import { ConfiguratorDataValueType, ThreekitDataT, ThreekitDataValueType } from '../../models/configurator/type'
import { ThreekitApi } from '../api/Threekit/ThreekitApi';
import { AssetI, AssetProxyI, AttributeI } from './type'

export class ThreekitService {
  private threekitApi: ThreekitApi = new ThreekitApi();

  public async getDataAssetById(assetId: string) {
		const response = await this.threekitApi.getAssetById(assetId);
		const asset: AssetI = response.data;

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

		
		return resultObject;
	}
}