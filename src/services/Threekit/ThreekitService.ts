import { ThreekitApi } from '../api/Threekit/ThreekitApi';
import { AssetI, AssetProxyI, AttributeI } from './type'

export class ThreekitService {
  private threekitApi: ThreekitApi = new ThreekitApi();

  public async getDataAssetById(assetId: string) {
		const response = await this.threekitApi.getAssetById(assetId);
		const asset: AssetI = response.data;
		

		const processAttribute = (attr: AttributeI) => {
			const data: {[key: string]: string | [] | object} = {
				name: attr['proxy']['name'],
				defaultValue: attr['proxy']['defaultValue'],
				type: attr['proxy']['type'],
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

    const infoAttrData = asset.attributes
      .map(processAttribute);

    const selectAttr: { [key: string]: string | [] | object } = {};

    infoAttrData.forEach((attr: {[key: string]: string | [] | object}) => {
      const name = attr['name'] as string;
      const defaultValue = attr['defaultValue'];
      selectAttr[name] = defaultValue;
    });

		console.log('infoAttrData', infoAttrData);
		console.log('selectAttr', selectAttr);
		
		return { infoAttrData, selectAttr };
	}
}