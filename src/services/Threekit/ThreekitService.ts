import { AttributeI } from "../../models/configurator/type";
import { isAssetType } from "../../utils/threekitUtils";
import { ThreekitApi } from "../api/Threekit/ThreekitApi";
import { AssetI, AssetProxyI, AttributeApiI } from "./type";

export class ThreekitService {
  private threekitApi: ThreekitApi = new ThreekitApi();

  public async getInitDataAssetById(assetId: string) {
    const response = await this.threekitApi.getAssetById(assetId);

    const asset: AssetI = response.data;

    type ObjAttrDataT = {
      [key: string]: {
        tagId: string;
      };
    };
    const objAttrData: ObjAttrDataT = asset.attributes
      .filter((attr: AttributeApiI) => attr["proxy"]["type"] === "Asset")
      .reduce((acc: ObjAttrDataT, attr: AttributeApiI) => {
        const values = attr["proxy"]["values"] as Array<AssetProxyI>;
        values.forEach((value, index) => {
          acc[`${attr["proxy"]["name"]} ${index}`] = {
            tagId: value["tagId"],
          };
        });
        return acc;
      }, {});

    const respPromises = Object.values(objAttrData)
      .filter(Boolean)
      .map((attrData) => this.threekitApi.getAssetsByTag(attrData["tagId"]));
    const results = await Promise.all(respPromises);

    const listAssetForAttr: { [key: string]: Array<object> } = {};
    Object.keys(objAttrData).forEach((key, index) => {
      const id = objAttrData[key]["tagId"];
      listAssetForAttr[id] = results[index]?.data.assets;
    });

    const processAttribute = (attr: AttributeApiI) => {
      const proxy = attr["proxy"];
      const data: AttributeI = {
        ...proxy,
        values: [],
      };
      const isAsset = isAssetType(proxy["type"]);
      if (isAsset) {
        const assets: Array<AssetI> = [];
        const values = attr["proxy"]["values"] as Array<AssetProxyI>;
        values.forEach((value) => {
          const id = value["tagId"];
          assets.push(...(listAssetForAttr[id] as Array<AssetI>));
        });

        return {
          ...data,
          values: assets,
        };
      }

      return {
        ...data,
        values: attr["proxy"]["values"],
      };
    };

    const attributes = asset.attributes.map(processAttribute);

    const level1TableId = asset.metadata["_datatable_configOptions_level1"];
    const dataTables = await this.getDataTablesById(level1TableId);

    const attributesSequenceLevel1 = asset.metadata["_level1_attributes_sequence"].split(',').map((aStr) => aStr.trim());

    return {
      attributes,
      dataTables,
      attributesSequenceLevel1
    };
  }

  public async getDataTablesById(dataTableId: string) {
    const response = await this.threekitApi.getDataTablesById(dataTableId);
    const dataTable = response.data;
    const rows = dataTable.rows;
    return rows;
  }
}
