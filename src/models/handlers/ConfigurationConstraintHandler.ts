import { isAssetType, isStringType } from "../../utils/threekitUtils";
import { Configurator } from "../configurator/Configurator";
import {
  AttributeI,
  ConfigurationI,
  ValueAssetStateI,
  ValueStringStateI,
} from "../configurator/type";
import { DataTable } from "../dataTable/DataTable";
import { Handler } from "./Handler";
import { AttrSpecI, RuleName } from "./type";
import { ThreekitService } from "../../services/Threekit/ThreekitService";
import { Application } from "../Application";
import { getSeparatorItemColor } from "../../utils/baseUtils";

declare const app: Application;

interface CacheI {
  [key: string]:
    | {
        [key: string]: string;
      }
    | string
    | boolean
    | undefined;
}
const CACHE_DATA: CacheI = {};

export class ConfigurationConstraintHandler extends Handler {
  private dataTableLevel1: DataTable;
  private dataTableLevel2: DataTable;
  private configurator: Configurator;
  constructor(
    configurator: Configurator,
    dataTableLevel1: DataTable,
    dataTableLevel2: DataTable
  ) {
    super();
    this.dataTableLevel1 = dataTableLevel1;
    this.dataTableLevel2 = dataTableLevel2;
    this.configurator = configurator;
  }

  public static addCacheData(key: string, value: any) {
    CACHE_DATA[key] = value;
  }

  public static getCacheData(key: string) {
    return CACHE_DATA[key];
  }

  public static getTriggeredAttribute(configurator: Configurator) {
    const attrArr = configurator.getAttributes();
    const configuration = configurator.getConfiguration();
    const cache = CACHE_DATA;
    const triggeredByAttr: Array<string> = [];
    attrArr.forEach((attr) => {
      if (cache.attrValCache && typeof cache.attrValCache === "object") {
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

  public async handle(): Promise<boolean> {
    const triggeredByAttr =
      ConfigurationConstraintHandler.getTriggeredAttribute(this.configurator);
    const localeTagStr = "locale_US";
    const leadingSpecCharForDefault = "*";
    const skipColumns = ["level2datatableId", "attrRules"];
    const level1AttrSequenceArr = this.configurator.attributesSequenceLevel1;
    const currentIndexInLevel1Sequence = level1AttrSequenceArr.indexOf(
      triggeredByAttr[0]
    );
    const firstLevel1AttrSelectedValue = this.getSelectedValue(
      level1AttrSequenceArr[0]
    );

    if (
      currentIndexInLevel1Sequence > -1 || //when user is configuring the level 1 attribute
      !firstLevel1AttrSelectedValue //when it's the initial state
    ) {
      this.validateLevel1Attr(
        localeTagStr,
        this.dataTableLevel1,
        leadingSpecCharForDefault,
        skipColumns,
        level1AttrSequenceArr,
        currentIndexInLevel1Sequence
      );
    }

    ////* 2nd - based on selection from level1 attributes to find level2 datatable to further validate level2 attributes
    const level2row = this.findLevel2Row(
      this.dataTableLevel1,
      level1AttrSequenceArr,
      leadingSpecCharForDefault
    );

    if (!level2row || !level2row.value) return true; //May need to set a flag for UI to know that it can't pass this step unless level1 attributes are all selected.

    const level2datatableId = level2row.value[skipColumns[0]];
    const attrRulesStr = level2row.value[skipColumns[1]];

    let setLevel2Default_flag = false;
    const cache = CACHE_DATA;
    if (
      !cache.level2datatableId ||
      cache.level2datatableId !== level2datatableId
    ) {
      setLevel2Default_flag = true;
      cache.level2datatableId = level2datatableId;
    }

    if (
      (this.dataTableLevel2.isEmpty() && level2datatableId) ||
      (!this.dataTableLevel2.isEmpty() &&
        level2datatableId !== this.dataTableLevel2.id)
    ) {
      app.eventEmitter.emit("processInitThreekitData", true);
      await new ThreekitService()
        .getDataTablesById(level2datatableId)
        .then((dataTables) => {
          this.dataTableLevel2 = new DataTable(dataTables).setId(
            level2datatableId
          );
          app.dataTableLevel2 = this.dataTableLevel2.copy();
          // After loading the data, call the handler
          this.proccesDataTableLavel2(
            localeTagStr,
            leadingSpecCharForDefault,
            setLevel2Default_flag,
            attrRulesStr
          );
          app.eventEmitter.emit("processInitThreekitData", false);
        });
    } else if (level2datatableId) {
      // Let's make sure that the level 2 table ID exists before calling the handler
      this.proccesDataTableLavel2(
        localeTagStr,
        leadingSpecCharForDefault,
        setLevel2Default_flag,
        attrRulesStr
      );
    }
    return true;
  }

  public proccesDataTableLavel2(
    localeTagStr: string,
    leadingSpecCharForDefault: string,
    setLevel2Default_flag: boolean,
    attrRulesStr: string
  ) {
    const setConfig_obj = this.validateAttributesWithDatatable(
      localeTagStr,
      this.dataTableLevel2,
      leadingSpecCharForDefault
    );
    if (!setConfig_obj) return true;
    const forceSetConfig_obj = this.forceSetOption(
      setConfig_obj,
      setLevel2Default_flag
    );
    const forcedSetAttrs = forceSetConfig_obj
      ? Object.keys(forceSetConfig_obj)
      : [];
    if (forcedSetAttrs.length > 0 && forceSetConfig_obj) {
      this.configurator.setConfiguration(forceSetConfig_obj);
    }

    ////*3rd call the rule(s) based on what's selected in the level1 datatable
    const attrRulesArr = attrRulesStr
      ? attrRulesStr.split(";").map((aStr: any) => aStr.trim())
      : [];

    if (attrRulesArr.indexOf(RuleName.tapQty_tapIp) > -1) {
      this.rule_tapQty10_tapIp();
    }

    if (attrRulesArr.indexOf(RuleName.micPodQty_sight) > -1) {
      this.rule_micPodQty_sight();
    }

    if (attrRulesArr.indexOf(RuleName.micPod_micMount_optional) > -1) {
      this.rule_micPod_micMount_optional();
    }

    if (attrRulesArr.indexOf(RuleName.micPod_micPodExt_optional) > -1) {
      this.rule_micPod_micPodExt_optional();
    }

    if (attrRulesArr.indexOf(RuleName.micPod_micPodHub_required) > -1) {
      this.rule_micPod_micPodHub_required();
    }

    this.rule_Mic_Mount_Mic();
    this.rule_Pendant_Mic();
    this.rule_Pendant_Mount_Mic();
    this.clearRuleCache();
  }

  private clearRuleCache() {
    const micAttrName_str = "Room Mic";
    const selectedMic = this.getSelectedValue(micAttrName_str);
    if (typeof selectedMic !== "object") {
      ConfigurationConstraintHandler.addCacheData(
        RuleName.micPod_micPodExt_optional,
        false
      );
      ConfigurationConstraintHandler.addCacheData(
        RuleName.micPod_micMount_optional,
        false
      );
    }
  }

  private rule_Mic_Mount_Mic() {
    const micAttrName_str = "Room Mic";
    const micPodQtyAttrName_str = "Qty - Micpod/Expansion";

    const mountMicQtyAttrName_str = "Qty - Mic Mount";

    const selectedMic = this.getSelectedValue(micAttrName_str);
    const selectedQtyMicPod = this.getSelectedValue(micPodQtyAttrName_str);

    if (
      typeof selectedMic === "object" &&
      typeof selectedQtyMicPod === "string"
    ) {
      const count = parseInt(selectedQtyMicPod);
      const attribute = this.getAttribute(mountMicQtyAttrName_str);
      const attrState = this.configurator.getAttributeState();
      const attributeValuesArr = attribute
        ? attrState[attribute.id].values
        : undefined;
      if (attribute && attributeValuesArr) {
        let tempCount = 0;
        attributeValuesArr.forEach((option) => {
          if (tempCount > count) {
            option.visible = false;
          }
          tempCount += 1;
        });
        this.configurator.setAttributeState(attribute.id, {
          values: attributeValuesArr,
        });
      }
    }
  }

  private rule_Pendant_Mic() {
    const micAttrName_str = "Room Mic";
    const micPodQtyAttrName_str = "Qty - Micpod/Expansion";

    const pendantQtyAttrName_str = "Qty - Mic Pendant Mount";

    const selectedMic = this.getSelectedValue(micAttrName_str);
    const selectedQtyMicPod = this.getSelectedValue(micPodQtyAttrName_str);

    if (
      typeof selectedMic === "object" &&
      typeof selectedQtyMicPod === "string"
    ) {
      const count = parseInt(selectedQtyMicPod);
      const attribute = this.getAttribute(pendantQtyAttrName_str);
      const attrState = this.configurator.getAttributeState();
      const attributeValuesArr = attribute
        ? attrState[attribute.id].values
        : undefined;
      if (attribute && attributeValuesArr) {
        let tempCount = 0;
        attributeValuesArr.forEach((option) => {
          if (tempCount > count) {
            option.visible = false;
          }
          tempCount += 1;
        });
        this.configurator.setAttributeState(attribute.id, {
          values: attributeValuesArr,
        });
      }
    }
  }

  private rule_Pendant_Mount_Mic() {
    const pendantAttrName_str = "Room Mic Pod Pendant Mount";
    const pendantQtyAttrName_str = "Qty - Mic Pendant Mount";

    const micMountQtyAttrName_str = "Qty - Mic Mount";

    const selectedPendant = this.getSelectedValue(pendantAttrName_str);
    const selectedQtyPendant = this.getSelectedValue(pendantQtyAttrName_str);

    if (
      typeof selectedPendant === "object" &&
      typeof selectedQtyPendant === "string"
    ) {
      const count = parseInt(selectedQtyPendant);
      const attribute = this.getAttribute(micMountQtyAttrName_str);
      const attrState = this.configurator.getAttributeState();
      const attributeValuesArr = attribute
        ? attrState[attribute.id].values
        : undefined;
      if (attribute && attributeValuesArr) {
        const countVisible = attributeValuesArr.filter(
          (option) => option.visible
        ).length;
        let tempCount = countVisible;
        attributeValuesArr.forEach((option) => {
          if (option.visible) {
            tempCount--;
          }
          if (tempCount < count) {
            option.visible = false;
          }
        });
        this.configurator.setAttributeState(attribute.id, {
          values: attributeValuesArr,
        });
      }
    }
  }

  private rule_micPod_micPodHub_required() {
    const micAttrName_str = "Room Mic";
    const micQtyAttrName_str = "Qty - Micpod/Expansion";

    const micMountAttrName_str = "Room Mic Mount";

    const micPodHubAttrName_str = "Room Mic Pod Hub";
    const micPodHubQtyAttrName_str = "Qty - Mic Pod Hub";

    const selectedMic = this.getSelectedValue(micAttrName_str);
    if (typeof selectedMic !== "object") return;

    const selectedMicQty = this.getSelectedValue(micQtyAttrName_str);
    if (typeof selectedMicQty !== "string" || selectedMicQty !== "2") return;

    const selectedMicMount = this.getSelectedValue(micMountAttrName_str);
    if (typeof selectedMicMount === "object") return;

    const selectedMicPodHub = this.getSelectedValue(micPodHubAttrName_str);
    if (typeof selectedMicPodHub === "object") return;

    const attribute = this.getAttribute(micPodHubAttrName_str);
    const attrState = this.configurator.getAttributeState();
    const attributeValuesArr = attribute
      ? attrState[attribute.id].values
      : undefined;

    if (attribute && attributeValuesArr) {
      const visibleValue = attributeValuesArr.find(
        (option) => option.visible
      ) as ValueAssetStateI;
      if (visibleValue) {
        this.configurator.setConfiguration({
          [micPodHubAttrName_str]: {
            assetId: visibleValue.id,
          },
          [micPodHubQtyAttrName_str]: "1",
        });
      }
    }
  }

  private rule_micPod_micPodExt_optional() {
    const micAttrName_str = "Room Mic";

    const micExtCableAttrName_str = "Room Mic Pod Extension Cable";
    const micExtCableQtyAttrName_str = "Qty - Mic Pod Extension Cable";

    const selectedMic = this.getSelectedValue(micAttrName_str);
    const objConfiguration: ConfigurationI = {
      [micExtCableAttrName_str]: {
        assetId: "",
      },
      [micExtCableQtyAttrName_str]: "0",
    };

    if (typeof selectedMic !== "object") {
      this.configurator.setConfiguration({
        ...objConfiguration,
      });
      return;
    }

    const isCacheData = ConfigurationConstraintHandler.getCacheData(
      RuleName.micPod_micPodExt_optional
    );
    if (isCacheData) return;

    const selectedExtCable = this.getSelectedValue(micExtCableAttrName_str);
    if (typeof selectedExtCable === "object") return;

    const attribute = this.getAttribute(micExtCableAttrName_str);
    const attrState = this.configurator.getAttributeState();
    const attributeValuesArr = attribute
      ? attrState[attribute.id].values
      : undefined;
    if (attribute && attributeValuesArr) {
      const visibleValue = attributeValuesArr.find(
        (option) => option.visible
      ) as ValueAssetStateI;
      if (visibleValue) {
        objConfiguration[micExtCableAttrName_str] = {
          assetId: visibleValue.id,
        };
        objConfiguration[micExtCableQtyAttrName_str] = "1";
      }
    }

    this.configurator.setConfiguration({
      ...objConfiguration,
    });

    ConfigurationConstraintHandler.addCacheData(
      RuleName.micPod_micPodExt_optional,
      true
    );
  }

  private rule_micPod_micMount_optional() {
    const isCacheData = ConfigurationConstraintHandler.getCacheData(
      RuleName.micPod_micMount_optional
    );
    if (isCacheData) return;
    const micAttrName_str = "Room Mic";
    const micPodQtyAttrName_str = "Qty - Micpod/Expansion";

    const micMountAttrName_str = "Room Mic Mount";
    const micMountQtyAttrName_str = "Qty - Mic Mount";

    const selectedMic = this.getSelectedValue(micAttrName_str);
    if (typeof selectedMic !== "object") return;

    const selectedMicMount = this.getSelectedValue(micMountAttrName_str);
    if (typeof selectedMicMount === "object") return;

    const qtyMicPod = this.getSelectedValue(micPodQtyAttrName_str);
    if (typeof qtyMicPod !== "string") return;

    const attributeMicMount = this.getAttribute(micMountAttrName_str);
    if (!attributeMicMount) return;

    const micAsset = this.findAssetByAssetId(
      selectedMic.id,
      micAttrName_str
    ) as ValueAssetStateI;
    if (!micAsset) return;

    const namesAssetMount = attributeMicMount.values.map(
      (value) => (value as ValueAssetStateI).name
    );
    const color = this.getColorFromAssetName(micAsset.name);
    const micMountAssetName = this.getNameAssetByColor(color, namesAssetMount);

    const micMountAsset = attributeMicMount.values.find(
      (value) => (value as ValueAssetStateI).name === micMountAssetName
    ) as ValueAssetStateI;
    if (!micMountAsset) return;

    this.configurator.setConfiguration({
      [micMountAttrName_str]: {
        assetId: micMountAsset.id,
      },
      [micMountQtyAttrName_str]: qtyMicPod,
    });

    ConfigurationConstraintHandler.addCacheData(
      RuleName.micPod_micMount_optional,
      true
    );
  }

  private rule_micPodQty_sight() {
    const sightAttrName_str = "Room Sight";
    const micPodQtyAttrName_str = "Qty - Micpod/Expansion";

    const selectedSight = this.getSelectedValue(sightAttrName_str);

    if (typeof selectedSight === "object") {
      const attribute = this.getAttribute(micPodQtyAttrName_str);
      const attrState = this.configurator.getAttributeState();
      const attributeValuesArr = attribute
        ? attrState[attribute.id].values
        : undefined;
      if (attribute && attributeValuesArr) {
        const countVisible = attributeValuesArr.filter(
          (option) => option.visible
        ).length;
        let tempCount = countVisible;
        attributeValuesArr.forEach((option) => {
          if (option.visible) {
            tempCount--;
          }
          if (tempCount === 0) {
            option.visible = false;
          }
        });
        this.configurator.setAttributeState(attribute.id, {
          values: attributeValuesArr,
        });
      }
    }
  }

  private rule_tapQty10_tapIp() {
    const meetingControllerAttrName_str = "Room Meeting Controller";
    const meetingControllerQtyAttr_str = "Qty - Meeting Controller";

    const selectedMeetingController = this.getSelectedValue(
      meetingControllerAttrName_str
    );
    if (
      typeof selectedMeetingController === "object" &&
      selectedMeetingController.name === "Logitech Tap IP"
    ) {
      const attribute = this.getAttribute(meetingControllerQtyAttr_str);
      const attrState = this.configurator.getAttributeState();
      const attributeValuesArr = attribute
        ? attrState[attribute.id].values
        : undefined;
      if (attribute && attributeValuesArr) {
        attributeValuesArr.forEach((option) => {
          if ("value" in option && Number(option.value) <= 10) {
            option.visible = true;
          }
        });
        this.configurator.setAttributeState(attribute.id, {
          values: attributeValuesArr,
        });
      }
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
      const copyAttrValuesArr = JSON.parse(
        JSON.stringify(theAttrValuesArr)
      ) as Array<ValueStringStateI | ValueAssetStateI>;

      copyAttrValuesArr.forEach((option) => {
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
          console.log("Option", option, "is not visible");

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
      console.log("copyAttrValuesArr", copyAttrValuesArr);

      this.configurator.setAttributeState(theAttrId, {
        values: copyAttrValuesArr,
      });
    }

    return attrSpec;
  }

  private validateAttributesWithDatatable(
    localeTagStr: string,
    dataTable: DataTable,
    leadingSpecCharForDefault = "*",
    skipColumns: Array<string> = [],
    attrSequenceArr: Array<string> = [],
    currentIndexInSequence = -1
  ) {
    if (currentIndexInSequence >= attrSequenceArr.length) return undefined;
    let attributeName_arr = dataTable
      .getColumnNames()
      .filter((attrName) => skipColumns.indexOf(attrName) < 0);
    const attrSpec_obj: AttrSpecI = {};

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

  private forceSetOption(validatedAttrSpec: AttrSpecI, setDefaults = false) {
    if (!validatedAttrSpec) return undefined;
    const setConfig_obj: ConfigurationI = {};
    const validatedAttrNames = Object.keys(validatedAttrSpec);

    for (let i = 0; i < validatedAttrNames.length; i++) {
      const attrName = validatedAttrNames[i];
      const currentSelectedValue = this.getSelectedValue(attrName);
      const currentSelectedValue_str = currentSelectedValue
        ? typeof currentSelectedValue === "object" && currentSelectedValue.id
          ? currentSelectedValue.id
          : currentSelectedValue
        : "";
      if (setDefaults) {
        setConfig_obj[attrName] =
          validatedAttrSpec[attrName].attrType === "Asset"
            ? {
                assetId: validatedAttrSpec[attrName].defaultValue,
              }
            : validatedAttrSpec[attrName].defaultValue;
      }

      if (
        //When not allow blank and only one option available set it to that option if it's currently not that value
        (!validatedAttrSpec[attrName].allowBlank &&
          validatedAttrSpec[attrName].validOptionIds &&
          validatedAttrSpec[attrName].validOptionIds.length === 1 &&
          currentSelectedValue_str !==
            validatedAttrSpec[attrName].validOptionIds[0]) ||
        //When allow blank and only one option is blank, set it to blank if it's currently not blank
        (validatedAttrSpec[attrName].allowBlank &&
          validatedAttrSpec[attrName].validOptionIds.length === 0 &&
          currentSelectedValue_str)
      ) {
        const setToVal = validatedAttrSpec[attrName].validOptionIds[0]
          ? validatedAttrSpec[attrName].validOptionIds[0]
          : "";
        setConfig_obj[attrName] =
          validatedAttrSpec[attrName].attrType === "Asset"
            ? {
                assetId: setToVal,
              }
            : setToVal;
      }
    }
    console.log("setConfig_obj is", setConfig_obj);
    return setConfig_obj;
  }

  private validateLevel1Attr(
    localeTagStr: string,
    dataTable: DataTable,
    leadingSpecCharForDefault = "*",
    skipColumns: Array<string> = [],
    level1AttrSequenceArr: Array<string> = [],
    currentIndexInLevel1Sequence: number
  ) {
    const setConfig_obj = this.validateAttributesWithDatatable(
      localeTagStr,
      dataTable,
      leadingSpecCharForDefault,
      skipColumns,
      level1AttrSequenceArr,
      currentIndexInLevel1Sequence
    );
    if (!setConfig_obj) return;

    const forceSetConfig_obj = this.forceSetOption(setConfig_obj);

    const forcedSetAttrs = forceSetConfig_obj
      ? Object.keys(forceSetConfig_obj)
      : [];
    console.log("forcedSetAttrs", forcedSetAttrs);
    if (forcedSetAttrs.length > 0 && forceSetConfig_obj) {
      //console.log('setConfig_obj is', setConfig_obj);
      this.configurator.setConfiguration(forceSetConfig_obj);
    } else {
      if (level1AttrSequenceArr[currentIndexInLevel1Sequence + 1]) {
        const nextInSequenceSelectedValue = this.getSelectedValue(
          level1AttrSequenceArr[currentIndexInLevel1Sequence + 1]
        );
        if (nextInSequenceSelectedValue) {
          this.validateLevel1Attr(
            localeTagStr,
            dataTable,
            leadingSpecCharForDefault,
            skipColumns,
            level1AttrSequenceArr,
            currentIndexInLevel1Sequence + 1
          );
        }
      }
    }
  }

  private findLevel2Row(
    dataTableLevel1: DataTable,
    attrSequenceArr: Array<string>,
    leadingSpecCharForDefault = "*"
  ) {
    if (attrSequenceArr.length < 1) return undefined;

    const selectedValueArr: Array<string> = [];
    for (let i = 0; i < attrSequenceArr.length; i++) {
      const selectedValue = this.getSelectedValue(attrSequenceArr[i]);
      const selectedValue_str = selectedValue
        ? typeof selectedValue === "object" && selectedValue.id
          ? selectedValue.name
          : selectedValue
        : "None";
      selectedValueArr.push(selectedValue_str as string);
    }

    const rows = dataTableLevel1.data;
    console.log("rows = ", { attrSequenceArr, rows });
    for (const row of rows) {
      let found_counter = 0;
      attrSequenceArr.forEach((attrName, attrIndex) => {
        if (row.value[attrName]) {
          const rowValue = row.value[attrName].trim();
          if (
            rowValue === selectedValueArr[attrIndex] ||
            rowValue === leadingSpecCharForDefault + selectedValueArr[attrIndex]
          )
            found_counter++;
        }
      });

      if (found_counter === attrSequenceArr.length) return row;
    }
    return undefined;
  }

  private findAssetByAssetId(assetId: string, attrName: string) {
    const attr = this.getAttribute(attrName);
    if (!attr) return undefined;
    const attrState = this.configurator.getAttributeState();
    const attrValuesArr = attrState[attr.id].values;
    if (!attrValuesArr) return undefined;
    return attrValuesArr.find(
      (option) =>
        typeof option === "object" &&
        (option as ValueAssetStateI).id === assetId
    ) as ValueAssetStateI;
  }

  private getColorFromAssetName(name: string) {
    const colorSeparator = getSeparatorItemColor();
    const color = name.split(colorSeparator)[1];
    return color;
  }

  private getNameAssetByColor(color: string, names: Array<string>) {
    const colorSeparator = getSeparatorItemColor();
    const name = names.find((n) => n.includes(colorSeparator + color));
    return name;
  }
}
