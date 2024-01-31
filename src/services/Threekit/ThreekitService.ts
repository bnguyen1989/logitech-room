import { ThreekitApi } from '../api/Threekit/ThreekitApi';

export class ThreekitService {
  private threekitApi: ThreekitApi = new ThreekitApi();

  public async getDataAssetById(assetId: string) {
		const response = await this.threekitApi.getAssetById(assetId);
		console.log(response.data);
		

		const processAttribute = (attr) => {
			const data: {[key: string]: string | [] | object} = {
				name: attr['proxy']['name'],
				defaultValue: attr['proxy']['defaultValue'],
				type: attr['proxy']['type'],
			}
			const isAsset = attr['proxy']['type'] === 'Asset';
			if(isAsset) {
				const value = attr['proxy']['values'][0];
				const id = value['assetId'] || value['tagId'];

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

    // Extracting asset tags
		type ObjAttrDataT = { [key: string]: {
			[key: string]: string
		} }
    const objAttrData: ObjAttrDataT = response.data.attributes
      .filter((attr: any) => attr['proxy']['type'] === 'Asset')
      .reduce((acc: ObjAttrDataT, attr: any) => {
				const value = attr['proxy']['values'][0];
				if (value['tagId']) {
					acc[attr['proxy']['name']] = {
						tagId: value['tagId']
					}
				}else {
					acc[attr['proxy']['name']] = {
						assetId: value['assetId']
					}
				}
        return acc;
      }, {});
			

    // Fetching assets by tags
    const respPromises = Object.values(objAttrData).filter(Boolean).map((attrData) =>
			attrData['assetId']
				? this.threekitApi.getAssetById(attrData['assetId'])
				: this.threekitApi.getAssetsByTag(attrData['tagId'])
    );
    const results = await Promise.all(respPromises);
		console.log(results);
		

    // Mapping assets to attributes
    const listAssetForAttr: { [key: string]: any } = {};
    Object.keys(objAttrData).forEach((key, index) => {
			const id = objAttrData[key]['assetId'] || objAttrData[key]['tagId'];
			if(objAttrData[key]['assetId']) {
				listAssetForAttr[id] = [results[index]?.data];
				return;
			}
      listAssetForAttr[id] = results[index]?.data.assets;
    });

    // Constructing final attributes data
    const infoAttrData = response.data.attributes
      .map(processAttribute);

    const selectAttr: { [key in string]: any } = {};

    infoAttrData.forEach((attr: any) => {
      const name = attr['name'];
      const defaultValue = attr['defaultValue'];
      selectAttr[name] = defaultValue;
    });

		console.log('infoAttrData', infoAttrData);
		console.log('selectAttr', selectAttr);
		
		return { infoAttrData, selectAttr };
	}
}