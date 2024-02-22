import { AssetI } from "../../services/Threekit/type";
import { isAssetType, isStringType } from "../../utils/threekitUtils";
import { Configurator } from "../configurator/Configurator";
import {
  AttributeI,
  AttributeStateI,
  ValueAssetStateI,
  ValueStringStateI,
} from "../configurator/type";
import { DataTable } from "../dataTable/DataTable";
import { Handler } from "./Handler";

interface CacheI {
  [key: string]: {
    [key: string]: string;
  };
}
const CACHE_DATA: CacheI = {};

export class RestrictionHandler extends Handler {
  private dataTable: DataTable;
  private level: number;
  private configurator: Configurator;
  constructor(configurator: Configurator, dataTable: DataTable, level: number) {
    super();
    this.dataTable = dataTable;
    this.level = level;
    this.configurator = configurator;
  }

  public static getTriggeredAttribute(configurator: Configurator) {
    const attrArr = configurator.getAttributes();
    const configuration = configurator.getConfiguration();
    const cache = CACHE_DATA;
    const triggeredByAttr: Array<string> = [];
    attrArr.forEach((attr) => {
      if (cache.attrValCache) {
        let attrValue = configuration[attr.name];
        if (typeof attrValue === "object" && attrValue["assetId"]) {
          attrValue = attrValue["assetId"];
        }
        if (cache.attrValCache[attr.name] !== attrValue) {
          // api.cache.attrValCache[attr.name]  === 'undefined', only when loading the configurator, because the cache is not created

          if (typeof cache.attrValCache[attr.name] !== "undefined") {
            triggeredByAttr.push(attr.name);
          }
          cache.attrValCache[attr.name] = attrValue as string;
        }
      } else {
        cache["attrValCache"] = {};
      }
    });
    return triggeredByAttr;
  }

  public handle(): boolean {
    const triggeredByAttr = RestrictionHandler.getTriggeredAttribute(
      this.configurator
    );

    const attributeName = this.dataTable.getColumnNames();

    attributeName.forEach((attrName) => {
      const attr = this.getAttribute(attrName);
      if (attr) {
        this.validateOption(attrName, attr);
      }
    });
    return true;
  }

  private validateOption(tableColName: string, theAttrValuesArr: AttributeI) {
    const optionNames: Array<string> =
      this.dataTable.getValuesByColumn(tableColName);

    if (isStringType(theAttrValuesArr.type)) {
      theAttrValuesArr.values = theAttrValuesArr.values.filter(
        (option: string | AssetI) => {
          return optionNames.includes(option as string);
        }
      );
    }

    if (isAssetType(theAttrValuesArr.type)) {
      theAttrValuesArr.values = theAttrValuesArr.values.filter(
        (option: string | AssetI) => {
          return optionNames.includes((option as AssetI).name);
        }
      );
    }
  }

  private getAttribute(name: string) {
    const attrArr = this.configurator.getAttributes() as Array<AttributeI>;
    const attr_asset = attrArr.find(
      (attr) => attr.name === name && isAssetType(attr.type)
    );
    if (attr_asset) return attr_asset;
    const attr_str = attrArr.find(
      (attr) => attr.name === name && isStringType(attr.type)
    );
    if (attr_str) return attr_str;

    return null;
  }

  private getAssetAttribute(name: string) {
    const attrArr = this.configurator.getAttributes();
    return attrArr.find((attr) => attr.name === name && isAssetType(attr.type));
  }

  private getSelectedValue(attrName: string) {
    const configuration = this.configurator.getConfiguration();
    const selectedItem = configuration[attrName];
    if (selectedItem && typeof selectedItem === "object") {
      const theAttr = this.getAssetAttribute(attrName);
      return selectedItem && selectedItem.assetId
        ? theAttr?.values.find(
            (value) =>
              typeof value === "object" && value.id === selectedItem.assetId
          )
        : "";
    }
    return selectedItem;
  }

  private validateOptionFromDatarows(
    localeTagStr: string,
    dataTable: DataTable,
    tableColName: string,
    theAttrId: string,
    theAttrValuesArr?: Array<ValueStringStateI | ValueAssetStateI>,
    leadingSpecCharForDefault = "*" // - Symbol of the default value
  ) {
    const rows = dataTable.data;
    const optionNames: Array<string> = [],
      attrSpec = {
        attrType: "Asset",
        allowBlank: false,
        validOptionNames: [] as Array<string>,
        validOptionIds: [] as Array<string>,
        defaultValue: "",
        preInvalid: "",
      };
    for (let i = 0; i < rows.length; i++) {
      const rowValue = rows[i].value[tableColName].trim();
      if (rowValue) {
        if (rowValue.indexOf(leadingSpecCharForDefault) == 0) {
          const dfOption = rowValue.substring(1);
          if (dfOption) {
            if (optionNames.indexOf(dfOption) < 0) optionNames.push(dfOption);
            attrSpec.defaultValue = dfOption;
            if (dfOption === "None") attrSpec.allowBlank = true;
          }
        } else {
          if (i === 0) attrSpec.defaultValue = rowValue;
          if (optionNames.indexOf(rowValue) < 0) optionNames.push(rowValue);
          if (rowValue === "None") attrSpec.allowBlank = true;
        }
      }
    }

    const selectedValue = this.getSelectedValue(tableColName);

    const selectedValue_str = selectedValue
      ? typeof selectedValue === "object" && selectedValue["id"]
        ? selectedValue.id
        : selectedValue
      : "None";
    if (theAttrValuesArr) {
      theAttrValuesArr.forEach((option) => {
        //Only show option when it's in the datatable
        const isContainName = "name" in option;
        const isContainValue = "value" in option;
        const isContainTags = "tags" in option;
        const isContainId = "id" in option;

        if (
          ((isContainName && optionNames.includes(option.name)) ||
            (isContainValue && optionNames.includes(option.value))) &&
          (!isContainTags ||
            (isContainTags && option.tags.includes(localeTagStr)))
        ) {
          option.visible = true;
          if (isContainName && isContainId) {
            attrSpec.validOptionNames.push(option.name);
            attrSpec.validOptionIds.push(option.id);
          }

          if (isContainValue) {
            attrSpec.validOptionNames.push(option.value);
            attrSpec.validOptionIds.push(option.value);
          }

          attrSpec.attrType = isContainId ? "Asset" : "String";
        } else {
          option.visible = false;
          if (
            selectedValue_str &&
            ((isContainId && selectedValue_str === option.id) ||
              (isContainValue && selectedValue_str === option.value))
          ) {
            if (isContainId) {
              attrSpec.preInvalid = option.id;
            }
            if (isContainValue) {
              attrSpec.preInvalid = option.value;
            }
          }
        }

        //store default value's assetId
        if (attrSpec.defaultValue === "None") {
          attrSpec.defaultValue = "";
        } else if (
          isContainName &&
          isContainId &&
          attrSpec.defaultValue === option.name //for asset type of attribute
        ) {
          attrSpec.defaultValue = option.id;
        }
      });
      this.configurator.setAttributeState(theAttrId, {
        values: theAttrValuesArr,
      });
    }

    return attrSpec;
  }

  private validateAttributesWithDatatable(
    localeTagStr: string,
    dataTable: DataTable,
    leadingSpecCharForDefault = "*",
    skipColumns: Array<string> = [],
    attrSequenceArr = [],
    currentIndexInSequence = -1
  ) {
    if (currentIndexInSequence >= attrSequenceArr.length) return undefined;
    let attributeName_arr = dataTable
      .getColumnNames()
      .filter((attrName) => skipColumns.indexOf(attrName) < 0);
    const attrSpec_obj: {
      [key: string]: {
        attrType: string;
        allowBlank: boolean;
        validOptionNames: Array<string>;
        validOptionIds: Array<string>;
        defaultValue: string;
        preInvalid: string;
      };
    } = {};

    let datarows = [...dataTable.data];
    //When there is attrSequence defined and user starts to select options from the attributes, shrink the options based on user selection.
    if (currentIndexInSequence > -1 && attrSequenceArr.length > 0) {
      for (let i = 0; i <= currentIndexInSequence; i++) {
        const selectedValue = this.getSelectedValue(attrSequenceArr[i]);

        const selectedValue_str = selectedValue
          ? typeof selectedValue === "object" && selectedValue.id
            ? selectedValue.name
            : selectedValue
          : "None";

        datarows = datarows.filter(
          (row) =>
            row.value[attrSequenceArr[i]] === selectedValue_str ||
            row.value[attrSequenceArr[i]] ===
              leadingSpecCharForDefault + selectedValue_str
        );
      }
      attributeName_arr = attrSequenceArr.slice(currentIndexInSequence + 1);
    }

    const copyDataTable = dataTable.copy();
    copyDataTable.data = datarows;

    attributeName_arr.map(async (attrName) => {
      const attribute = this.getAttribute(attrName);
      if (!attribute) return;
      const attrState = this.configurator.getAttributeState();
      // Looking for the appropriate attributes in the State Threekit attr
      const attributeValuesArr = attribute
        ? attrState[attribute.id].values
        : undefined;

      const attrSpec = this.validateOptionFromDatarows(
        localeTagStr,
        copyDataTable,
        attrName,
        attribute.id,
        attributeValuesArr,
        leadingSpecCharForDefault
      );
      attrSpec_obj[attrName] = attrSpec;
    });

    return attrSpec_obj;
  }
}
