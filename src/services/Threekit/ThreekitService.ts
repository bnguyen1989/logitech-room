import { ConfiguratorDataValueType, ThreekitDataT, ThreekitDataValueType } from '../../models/configurator/type'
import { ThreekitApi } from '../api/Threekit/ThreekitApi';
import { AssetI, AssetProxyI, AttributeI, DataTableRowI } from './type'

export class ThreekitService {
  private threekitApi: ThreekitApi = new ThreekitApi();

  public async getDataAssetById(assetId: string) {
		const response = await this.threekitApi.getAssetById(assetId);
		const asset: AssetI = response.data;
		console.log('ASSET', asset);
		

		type ObjAttrDataT = { [key: string]: {
			[key: string]: string
		} }
    const objAttrData: ObjAttrDataT = asset.attributes
      .filter((attr: AttributeI) => attr['proxy']['type'] === 'Asset')
      .reduce((acc: ObjAttrDataT, attr: AttributeI) => {
				const value = attr['proxy']['values'][0] as AssetProxyI;
				if (value['tagId']) {
					acc[attr['proxy']['name']] = {
						tagId: value['tagId']
					}
				}else if (value['assetId']){
					acc[attr['proxy']['name']] = {
						assetId: value['assetId']
					}
				}
        return acc;
      }, {});
			

    const respPromises = Object.values(objAttrData).filter(Boolean).map((attrData) =>
			attrData['assetId']
				? this.threekitApi.getAssetById(attrData['assetId'])
				: this.threekitApi.getAssetsByTag(attrData['tagId'])
    );
    const results = await Promise.all(respPromises);
		console.log(results);
		

    const listAssetForAttr: { [key: string]: Array<object> } = {};
    Object.keys(objAttrData).forEach((key, index) => {
			const id = objAttrData[key]['assetId'] || objAttrData[key]['tagId'];
			if(objAttrData[key]['assetId']) {
				listAssetForAttr[id] = [results[index]?.data];
				return;
			}
      listAssetForAttr[id] = results[index]?.data.assets;
    });

		const processAttribute = (attr: AttributeI) => {
			const data: ThreekitDataValueType = {
				name: attr['proxy']['name'] as string,
				defaultValue: attr['proxy']['defaultValue'] as ConfiguratorDataValueType,
				type: attr['proxy']['type'] as string,
				values: [],
			}
			const isAsset = attr['proxy']['type'] === 'Asset';
			if(isAsset) {
				const value = attr['proxy']['values'][0] as AssetProxyI;
				const id = value['assetId'] || value['tagId'] as string;

				return {
					...data,
					values: listAssetForAttr[id],
				}
			}

			return {
				...data,
				values: attr['proxy']['values'],
			}
		}

    const infoAttrData = asset.attributes.map(processAttribute);

		const resultObject: ThreekitDataT = {};
		infoAttrData.forEach((obj) => {
			const name = obj['name'] as string;
			resultObject[name] = obj as ThreekitDataValueType;
		});

		const tableId_optionLookup = asset.metadata['_datatable_configOptions'];
		const dataTables = await this.getDataTablesById(tableId_optionLookup);
		console.log('DATA TABLES', dataTables);

		const attributeName_arr = [];
    if(dataTables && dataTables[0]) {
        for(const attrName in dataTables[0].value) {
            attributeName_arr.push(attrName);
        }
    }

		attributeName_arr.forEach((attrName) => {
			const attr = this.getAttribute(attrName, Object.values(resultObject));
			if(attr) {
				const res = this.validateOption(dataTables, attrName, attr);
				resultObject[attrName] = res;
			}
		});

		
		return resultObject;
	}

	public async getDataTablesById(dataTableId: string) {
		const response = await this.threekitApi.getDataTablesById(dataTableId);
		const dataTable = response.data;
		const rows = dataTable.rows;
		return rows;
	}

	private validateOption(rows: Array<DataTableRowI>, tableColName: string, theAttrValuesArr: ThreekitDataValueType) {
    const optionNames: Array<string> = [];
    for(const row of rows){
        if(row.value[tableColName]) optionNames.push(row.value[tableColName]);
    }

		console.log('OPTION NAMES', optionNames);
		

		const res: ThreekitDataValueType = {...theAttrValuesArr};

		if(res.type === 'String') {
			res.values = res.values.filter((option: ConfiguratorDataValueType) => {
				return optionNames.includes(option as string);
			});
		}

		if(theAttrValuesArr.type === 'Asset') {
			res.values = res.values.filter((option: ConfiguratorDataValueType) => {
				return optionNames.includes((option as AssetI).name);
			});
		}

		return res;
		
	}

	private getAttribute(name: string, attrArr: Array<ThreekitDataValueType>){
    const attr_asset = attrArr.find((attr) => attr.name === name && attr.type === 'Asset');
    if(attr_asset) return attr_asset;
    const attr_str = attrArr.find((attr) => attr.name === name && attr.type === 'String');
    if(attr_str) return attr_str;
    
    return "";
}
}