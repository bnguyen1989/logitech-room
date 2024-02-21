import {
  AttributeI,
} from "../../models/configurator/type";
import { isAssetType } from '../../utils/threekitUtils'
import { ThreekitApi } from "../api/Threekit/ThreekitApi";
import { AssetI, AssetProxyI, AttributeApiI } from "./type";

export class ThreekitService {
  private threekitApi: ThreekitApi = new ThreekitApi();

  public async getDataAssetById(assetId: string) {
    const response = await this.threekitApi.getAssetById(assetId);
    console.log("response", response.data);
    console.log("response", JSON.stringify(response.data));
    
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
      .map((attrData) =>
        this.threekitApi.getAssetsByTag(attrData["tagId"])
      );
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
          assets.push(...listAssetForAttr[id] as Array<AssetI>);
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

    // const infoAttrData = asset.attributes.map(processAttribute);

    // const resultObject: ThreekitDataT = {};
    // infoAttrData.forEach((obj) => {
    //   const name = obj["name"];
    //   resultObject[name] = obj;
    // });

    // const tableId_optionLookup = asset.metadata["_datatable_configOptions"];
    // const dataTables = await this.getDataTablesById(tableId_optionLookup);

    // const attributeName_arr = [];
    // if (dataTables && dataTables[0]) {
    //   for (const attrName in dataTables[0].value) {
    //     attributeName_arr.push(attrName);
    //   }
    // }

    // attributeName_arr.forEach((attrName) => {
    //   const attr = this.getAttribute(attrName, Object.values(resultObject));
    //   if (attr) {
    //     const res = this.validateOption(dataTables, attrName, attr);
    //     resultObject[attrName] = res;
    //   }
    // });

    return asset.attributes.map(processAttribute);
  }

  public async getDataTablesById(dataTableId: string) {
    const response = await this.threekitApi.getDataTablesById(dataTableId);
    const dataTable = response.data;
    const rows = dataTable.rows;
    return rows;
  }

  // private validateOption(
  //   rows: Array<DataTableRowI>,
  //   tableColName: string,
  //   theAttrValuesArr: ThreekitDataValueType
  // ) {
  //   const optionNames: Array<string> = [];
  //   for (const row of rows) {
  //     if (row.value[tableColName]) optionNames.push(row.value[tableColName]);
  //   }

  //   const res: ThreekitDataValueType = { ...theAttrValuesArr };

  //   if (res.type === "String") {
  //     res.values = res.values.filter((option: ConfiguratorDataValueType) => {
  //       return optionNames.includes(option as string);
  //     });
  //   }

  //   if (theAttrValuesArr.type === "Asset") {
  //     res.values = res.values.filter((option: ConfiguratorDataValueType) => {
  //       return optionNames.includes((option as AssetI).name);
  //     });
  //   }

  //   return res;
  // }

  // private getAttribute(name: string, attrArr: Array<ThreekitDataValueType>) {
  //   const attr_asset = attrArr.find(
  //     (attr) => attr.name === name && attr.type === "Asset"
  //   );
  //   if (attr_asset) return attr_asset;
  //   const attr_str = attrArr.find(
  //     (attr) => attr.name === name && attr.type === "String"
  //   );
  //   if (attr_str) return attr_str;

  //   return "";
  // }
}
