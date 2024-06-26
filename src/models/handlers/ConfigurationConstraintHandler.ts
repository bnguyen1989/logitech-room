import { isAssetType, isStringType } from "../../utils/threekitUtils";
import { Configurator } from "../configurator/Configurator";
import {
  AttributeI,
  AttributeName,
  ConfigurationI,
  ValueAssetStateI,
  ValueAttributeStateI,
  ValueStringStateI,
} from "../configurator/type";
import { DataTable } from "../dataTable/DataTable";
import { Handler } from "./Handler";
import { AttrSpecI, RuleName } from "./type";
import { ThreekitService } from "../../services/Threekit/ThreekitService";
import { Application } from "../Application";
import { ColorName, getSeparatorItemColor } from "../../utils/baseUtils";
import { CameraName, MeetingControllerName } from "../../utils/permissionUtils";
import { Cache } from "../Cache";
import { deepCopy } from "../../utils/objUtils";

declare const app: Application;

type DataCache =
  | {
      [key: string]: string;
    }
  | string
  | boolean
  | undefined;
interface CacheI {
  [key: string]: DataCache;
}

const CACHE = new Cache<CacheI, DataCache>();

export class ConfigurationConstraintHandler extends Handler {
  private dataTableLevel1: DataTable;
  private dataTableLevel2: DataTable;
  private configurator: Configurator;
  private triggeredByAttr: Array<string> = [];
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

  public static clearCacheData() {
    CACHE.clearCache();
  }

  public static getTriggeredAttribute(configurator: Configurator) {
    const attrArr = configurator.getAttributes();
    const configuration = configurator.getConfiguration();
    const attrValCache = CACHE.get("attrValCache");
    const triggeredByAttr: Array<string> = [];
    attrArr.forEach((attr) => {
      if (attrValCache && typeof attrValCache === "object") {
        let attrValue = configuration[attr.name];
        if (typeof attrValue === "object" && attrValue["assetId"]) {
          attrValue = attrValue["assetId"];
        }
        if (attrValCache[attr.name] !== attrValue) {
          if (typeof attrValCache[attr.name] !== "undefined") {
            triggeredByAttr.push(attr.name);
          }
          CACHE.update("attrValCache", {
            [attr.name]: attrValue as string,
          });
        }
      } else {
        CACHE.set("attrValCache", {});
      }
    });
    return triggeredByAttr;
  }

  public async handle(): Promise<boolean> {
    const triggeredByAttr =
      ConfigurationConstraintHandler.getTriggeredAttribute(this.configurator);
    this.triggeredByAttr = triggeredByAttr;

    const locale = this.configurator.language;
    const localeTagStr = `locale_${locale.toLowerCase()}`;
    const leadingSpecCharForDefault = "*";
    const leadingSpecCharForRecommended = "r";
    const skipColumns = ["level2datatableId", "attrRules", "recoRules"];
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
        leadingSpecCharForRecommended,
        skipColumns,
        level1AttrSequenceArr,
        currentIndexInLevel1Sequence
      );
    }

    ////* 2nd - based on selection from level1 attributes to find level2 datatable to further validate level2 attributes
    const level2row = this.findLevel2Row(
      this.dataTableLevel1,
      level1AttrSequenceArr,
      leadingSpecCharForDefault,
      leadingSpecCharForRecommended
    );

    //May need to set a flag for UI to know that it can't pass this step unless level1 attributes are all selected.
    if (!level2row || !level2row.value) {
      //disabled all options in the level 2 attributes if the level 1 attributes are not all selected
      //todo: Temp solution
      const attrState = this.getAttrStateDataByName(
        AttributeName.RoomAdditionalCamera
      );
      if (attrState) {
        const values = deepCopy(attrState.values) as ValueAssetStateI[];

        values.forEach((option) => {
          option.visible = false;
        });

        this.configurator.setAttributeState(attrState.id, {
          values: values,
        });
      }

      return true;
    }

    const level2datatableId = level2row.value[skipColumns[0]];
    const attrRulesStr = level2row.value[skipColumns[1]];
    const recoRulesStr = level2row.value[skipColumns[2]];

    let setLevel2Default_flag = false;
    const cacheLevel2Id = CACHE.get("level2datatableId");
    if (!cacheLevel2Id || cacheLevel2Id !== level2datatableId) {
      setLevel2Default_flag = true;
      CACHE.set("level2datatableId", level2datatableId);
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
            leadingSpecCharForRecommended,
            setLevel2Default_flag,
            attrRulesStr,
            recoRulesStr
          );
          app.eventEmitter.emit("processInitThreekitData", false);
        });
    } else if (level2datatableId) {
      // Let's make sure that the level 2 table ID exists before calling the handler
      this.proccesDataTableLavel2(
        localeTagStr,
        leadingSpecCharForDefault,
        leadingSpecCharForRecommended,
        setLevel2Default_flag,
        attrRulesStr,
        recoRulesStr
      );
    }

    ConfigurationConstraintHandler.getTriggeredAttribute(this.configurator);
    return true;
  }

  public proccesDataTableLavel2(
    localeTagStr: string,
    leadingSpecCharForDefault: string,
    leadingSpecCharForRecommended: string,
    setLevel2Default_flag: boolean,
    attrRulesStr: string,
    recoRulesStr: string
  ) {
    const setConfig_obj = this.validateAttributesWithDatatable(
      localeTagStr,
      this.dataTableLevel2,
      leadingSpecCharForDefault,
      leadingSpecCharForRecommended
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
    this.handleRecoRules(recoRulesStr);
    this.handleAttrRules(attrRulesStr);
  }

  private handleAttrRules(attrRulesStr: string) {
    const attrRulesArr = attrRulesStr
      ? attrRulesStr.split(";").map((aStr: any) => aStr.trim())
      : [];

    if (attrRulesArr.includes(RuleName.tapQty_tapIp)) {
      this.rule_tapQty10_tapIp();
    }

    if (attrRulesArr.includes(RuleName.micPodQty_sight)) {
      this.rule_micPodQty_sight();
    }

    if (attrRulesArr.includes(RuleName.micPod_micMount_inNoneWhite)) {
      this.rule_micPod_micMount_inNoneWhite();
    }

    if (attrRulesArr.includes(RuleName.micPod_micMount_inWhite)) {
      this.rule_micPod_micMount_inWhite();
    }

    if (attrRulesArr.includes(RuleName.micPod_CATCoupler)) {
      this.rule_micPod_CATCoupler();
    }

    if (attrRulesArr.includes(RuleName.rallyBar_TapIp_bundle)) {
      this.rule_rallyBar_TapIp_bundle();
    }

    if (attrRulesArr.includes(RuleName.rallyBarMini_TapIp_bundle)) {
      this.rule_rallyBarMini_TapIp_bundle();
    }

    if (attrRulesArr.includes(RuleName.rallyPlus_bundle)) {
      this.rule_rallyPlus_bundle();
    }

    if (attrRulesArr.includes(RuleName.byod_reqOneAddon)) {
      this.rule_byod_reqOneAddon();
    }
  }

  private handleRecoRules(recoRulesStr: string) {
    const recoRulesArr = recoRulesStr
      ? recoRulesStr.split(";").map((aStr: any) => aStr.trim())
      : [];

    if (recoRulesArr.includes(RuleName.reco_micPod_micPodHub)) {
      this.rule_reco_micPod_micPodHub();
    }

    if (recoRulesArr.includes(RuleName.reco_micPendantMount_inWhite)) {
      this.rule_reco_micPendantMount_inWhite();
    }

    if (recoRulesArr.includes(RuleName.reco_RallyBar)) {
      this.rule_reco_RallyBar();
    }

    if (recoRulesArr.includes(RuleName.reco_RallyPlus)) {
      this.rule_reco_RallyPlus();
    }
  }

  private rule_rallyPlus_bundle() {
    const isSelectRallyPlus = this.isSelectRallyPlus();

    const attrDataQtyMicPod = this.getAttrStateDataByName(AttributeName.QtyMic);
    if (!attrDataQtyMicPod) return;

    const allCountMicPod = attrDataQtyMicPod.values.length - 1;
    const minMicPod = 2;
    if (!isSelectRallyPlus) {
      this.limitValuesAttrByCallback(
        attrDataQtyMicPod.values,
        attrDataQtyMicPod.id,
        (currentCount: number) => currentCount <= allCountMicPod
      );
      return;
    }
    this.limitValuesAttrByCallback(
      attrDataQtyMicPod.values,
      attrDataQtyMicPod.id,
      (currentCount: number) => currentCount >= minMicPod
    );
    const isChangeRallyPlus = this.triggeredByAttr.includes(
      AttributeName.RoomCamera
    );
    if (!isChangeRallyPlus) return;

    this.configurator.setConfiguration({
      [AttributeName.QtyMic]: minMicPod.toString(),
    });
  }

  private rule_rallyBar_TapIp_bundle() {
    this.rule_camera_TapIp_bundle(
      CameraName.RallyBar,
      MeetingControllerName.RallyBarTapIP
    );
  }

  private rule_rallyBarMini_TapIp_bundle() {
    this.rule_camera_TapIp_bundle(
      CameraName.RallyBarMini,
      MeetingControllerName.RallyBarMiniTapIP
    );
  }

  private rule_camera_TapIp_bundle(cameraName: string, bundleName: string) {
    const selectedCamera = this.getSelectedValue(AttributeName.RoomCamera);
    const isSelectCamera = typeof selectedCamera === "object";
    const isSelectRallyBar =
      isSelectCamera && selectedCamera.name.includes(cameraName);
    const colorSelectCamera =
      isSelectRallyBar && this.getColorFromAssetName(selectedCamera.name);
    const isCameraGraphite = colorSelectCamera === ColorName.Graphite;

    const selectTapIp = this.getSelectedValue(AttributeName.RoomMeetingTapIp);

    const isSelectTapIp = typeof selectTapIp === "object";

    const colorSelectTapIP =
      isSelectTapIp && this.getColorFromAssetName(selectTapIp.name);
    const isSelectTapIPGraphite = colorSelectTapIP === ColorName.Graphite;

    if (!isCameraGraphite || !isSelectTapIPGraphite) {
      this.configurator.setConfiguration({
        [AttributeName.RoomProductBundle]: {
          assetId: "",
        },
      });
      return;
    }

    const attribute = this.getAttribute(AttributeName.RoomProductBundle);
    if (!attribute) return;
    const attrState = this.configurator.getAttributeState();
    const attributeValuesArr = attrState[attribute.id].values;
    if (!attributeValuesArr) return;

    const visibleValues = attributeValuesArr.filter(
      (option) => option.visible
    ) as ValueAssetStateI[];
    if (!visibleValues.length) return;
    const bundleElement = visibleValues.find((option) =>
      option.name.includes(bundleName)
    );
    if (!bundleElement) return;

    this.configurator.setConfiguration({
      [AttributeName.RoomProductBundle]: {
        assetId: bundleElement.id,
      },
    });
  }

  private rule_micPod_micMount_inWhite() {
    const selectedMic = this.getSelectedValue(AttributeName.RoomMic);
    const isSelectMic = typeof selectedMic === "object";
    const colorSelectMic =
      isSelectMic && this.getColorFromAssetName(selectedMic.name);
    if (colorSelectMic !== "White") return;

    const selectedMicMount = this.getSelectedValue(AttributeName.RoomMicMount);
    const isSelectMicMount = typeof selectedMicMount === "object";

    const selectedPendant = this.getSelectedValue(
      AttributeName.RoomMicPendantMount
    );
    const isSelectPendant = typeof selectedPendant === "object";

    const qtyMicPod = this.getSelectedValue(AttributeName.QtyMic);
    if (typeof qtyMicPod !== "string") return;

    if (!isSelectMicMount && isSelectPendant) {
      this.configurator.setConfiguration({
        [AttributeName.QtyMicPendantMount]: qtyMicPod,
      });
    }

    if (isSelectMicMount && !isSelectPendant) {
      this.configurator.setConfiguration({
        [AttributeName.QtyMicMount]: qtyMicPod,
      });
    }

    const attrDataQtyMicMount = this.getAttrStateDataByName(
      AttributeName.QtyMicMount
    );
    const attrDataQtyPendantMount = this.getAttrStateDataByName(
      AttributeName.QtyMicPendantMount
    );
    if (!attrDataQtyPendantMount || !attrDataQtyMicMount) return;

    const availableCountMic = this.getQtyMicForMounts();

    this.limitValuesAttrByCallback(
      attrDataQtyMicMount.values,
      attrDataQtyMicMount.id,
      (currentCount: number) => currentCount <= availableCountMic
    );

    this.limitValuesAttrByCallback(
      attrDataQtyPendantMount.values,
      attrDataQtyPendantMount.id,
      (currentCount: number) => currentCount <= availableCountMic
    );

    const qtyMicMount = this.getSelectedValue(AttributeName.QtyMicMount);
    if (typeof qtyMicMount !== "string") return;
    const qtyMicPendantMount = this.getSelectedValue(
      AttributeName.QtyMicPendantMount
    );
    if (typeof qtyMicPendantMount !== "string") return;
    const countMicMount = parseInt(qtyMicMount);
    const countMicPendantMount = parseInt(qtyMicPendantMount);
    const countAllMount = countMicMount + countMicPendantMount;
    if (countAllMount === availableCountMic) return;
    if (!isSelectMicMount || !isSelectPendant) return;
    const isChangeQtyMicMount = this.triggeredByAttr.includes(
      AttributeName.QtyMicMount
    );
    const isChangeQtyMicPendantMount = this.triggeredByAttr.includes(
      AttributeName.QtyMicPendantMount
    );
    if (isChangeQtyMicMount && isChangeQtyMicPendantMount) return;

    if (
      availableCountMic > countAllMount &&
      !isChangeQtyMicMount &&
      !isChangeQtyMicPendantMount
    ) {
      if (countMicMount > countMicPendantMount) {
        this.configurator.setConfiguration({
          [AttributeName.QtyMicPendantMount]: (
            availableCountMic - countMicMount
          ).toString(),
        });
      } else {
        this.configurator.setConfiguration({
          [AttributeName.QtyMicMount]: (
            availableCountMic - countMicPendantMount
          ).toString(),
        });
      }
      return;
    }

    const removeMount = (attrName: string, qtyName: string) => {
      this.configurator.setConfiguration({
        [attrName]: {
          assetId: "",
        },
        [qtyName]: "0",
      });
    };

    if (
      availableCountMic < countAllMount &&
      !isChangeQtyMicMount &&
      !isChangeQtyMicPendantMount
    ) {
      if (countMicMount > countMicPendantMount) {
        const count = availableCountMic - countMicPendantMount;
        this.configurator.setConfiguration({
          [AttributeName.QtyMicMount]: count.toString(),
        });
        if (count === 0) {
          removeMount(AttributeName.RoomMicMount, AttributeName.QtyMicMount);
        }
      } else {
        const count = availableCountMic - countMicMount;
        this.configurator.setConfiguration({
          [AttributeName.QtyMicPendantMount]: count.toString(),
        });
        if (count === 0) {
          removeMount(
            AttributeName.RoomMicPendantMount,
            AttributeName.QtyMicPendantMount
          );
        }
      }
      return;
    }

    if (countAllMount > availableCountMic) {
      if (isChangeQtyMicMount) {
        const count = countMicPendantMount - 1;
        this.configurator.setConfiguration({
          [AttributeName.QtyMicPendantMount]: count.toString(),
        });
        if (count === 0) {
          removeMount(
            AttributeName.RoomMicPendantMount,
            AttributeName.QtyMicPendantMount
          );
        }
      }
      if (isChangeQtyMicPendantMount) {
        const count = countMicMount - 1;
        this.configurator.setConfiguration({
          [AttributeName.QtyMicMount]: count.toString(),
        });
        if (count === 0) {
          removeMount(AttributeName.RoomMicMount, AttributeName.QtyMicMount);
        }
      }
      return;
    }
    if (isChangeQtyMicMount) {
      const count = countMicPendantMount + 1;
      this.configurator.setConfiguration({
        [AttributeName.QtyMicPendantMount]: count.toString(),
      });
      if (count === availableCountMic) {
        removeMount(AttributeName.RoomMicMount, AttributeName.QtyMicMount);
      }
    }
    if (isChangeQtyMicPendantMount) {
      const count = countMicMount + 1;
      this.configurator.setConfiguration({
        [AttributeName.QtyMicMount]: count.toString(),
      });
      if (count === availableCountMic) {
        removeMount(
          AttributeName.RoomMicPendantMount,
          AttributeName.QtyMicPendantMount
        );
      }
    }
  }

  private rule_micPod_micMount_inNoneWhite() {
    const selectedMic = this.getSelectedValue(AttributeName.RoomMic);
    const isSelectMic = typeof selectedMic === "object";

    const attrDataMicMount = this.getAttrStateDataByName(
      AttributeName.RoomMicMount
    );
    if (!attrDataMicMount) return;

    if (isSelectMic) {
      attrDataMicMount.values.forEach((option) => {
        option.visible = true;
      });
    } else {
      attrDataMicMount.values.forEach((option) => {
        option.visible = false;
      });
      this.configurator.setConfiguration({
        [AttributeName.RoomMicMount]: {
          assetId: "",
        },
        [AttributeName.QtyMicMount]: "0",
      });
    }

    this.configurator.setAttributeState(attrDataMicMount.id, {
      values: attrDataMicMount.values,
    });

    const isSelectMicWhite =
      isSelectMic && this.getColorFromAssetName(selectedMic.name) === "White";
    if (isSelectMicWhite) return;

    const selectedMicMount = this.getSelectedValue(AttributeName.RoomMicMount);
    const isSelectMicMount = typeof selectedMicMount === "object";
    if (!isSelectMicMount) return;

    const qtyMicPod = this.getSelectedValue(AttributeName.QtyMic);
    if (typeof qtyMicPod !== "string") return;

    this.configurator.setConfiguration({
      [AttributeName.QtyMicMount]: qtyMicPod,
    });
  }

  private rule_micPod_CATCoupler() {
    const selectedMic = this.getSelectedValue(AttributeName.RoomMic);
    const isSelectMic = typeof selectedMic === "object";
    const attribute = this.getAttribute(AttributeName.RoomMicCATCoupler);
    if (!attribute) return;
    const attrState = this.configurator.getAttributeState();
    const attributeValuesArr = attrState[attribute.id].values;
    if (!attributeValuesArr) return;

    if (!isSelectMic) {
      this.configurator.setConfiguration({
        [AttributeName.RoomMicCATCoupler]: {
          assetId: "",
        },
      });

      attributeValuesArr.forEach((option) => {
        option.visible = false;
      });
    } else {
      attributeValuesArr.forEach((option) => {
        option.visible = true;
      });
    }

    const selectSight = this.getSelectedValue(AttributeName.RoomSight);
    const isSelectSight = typeof selectSight === "object";
    if (isSelectSight) {
      attributeValuesArr.forEach((option) => {
        this.setRecommendedInMetadata(option, false);
      });
    }

    this.configurator.setAttributeState(attribute.id, {
      values: attributeValuesArr,
    });

    const cache = CACHE.get(RuleName.micPod_CATCoupler);
    const isChangeSight = this.triggeredByAttr.includes(
      AttributeName.RoomSight
    );
    if (!cache && isSelectSight && isChangeSight) {
      this.configurator.setConfiguration({
        [AttributeName.RoomMicCATCoupler]: {
          assetId: "",
        },
      });
      CACHE.set(RuleName.micPod_CATCoupler, true);
    }
  }

  private rule_byod_reqOneAddon() {
    const arrAttrName = [
      AttributeName.RoomSwytch,
      AttributeName.RoomExtend,
      AttributeName.RoomUSBAtoHDMICable,
    ];
    const isSelectOne = arrAttrName.some(
      (attrName) => typeof this.getSelectedValue(attrName) === "object"
    );
    if (isSelectOne) return;

    for (const attrName of arrAttrName) {
      const attrState = this.getAttrStateDataByName(attrName);
      if (!attrState) continue;
      const values = deepCopy(attrState.values) as ValueAssetStateI[];
      const visibleOption = values.find((option) => option.visible);

      if (!visibleOption) continue;

      this.configurator.setConfiguration({
        [attrName]: {
          assetId: visibleOption.id,
        },
      });
      break;
    }
  }

  private rule_reco_micPendantMount_inWhite() {
    const selectedMic = this.getSelectedValue(AttributeName.RoomMic);
    const attribute = this.getAttribute(AttributeName.RoomMicPendantMount);
    if (!attribute) return;
    const attrState = this.configurator.getAttributeState();
    const attributeValuesArr = deepCopy(
      attrState[attribute.id].values
    ) as ValueAssetStateI[];
    if (!attributeValuesArr) return;
    const isSelectMic = typeof selectedMic === "object";
    const isSelectMicWhite =
      isSelectMic && this.getColorFromAssetName(selectedMic.name) === "White";
    if (isSelectMicWhite) {
      attributeValuesArr.forEach((option) => {
        this.setRecommendedInMetadata(option, true);
        option.visible = true;
      });
    } else {
      attributeValuesArr.forEach((option) => {
        this.setRecommendedInMetadata(option, false);
        option.visible = false;
      });
      this.configurator.setConfiguration({
        [AttributeName.RoomMicPendantMount]: {
          assetId: "",
        },
        [AttributeName.QtyMicPendantMount]: "0",
      });
    }

    this.configurator.setAttributeState(attribute.id, {
      values: attributeValuesArr,
    });

    const cache = CACHE.get(RuleName.reco_micPendantMount_inWhite);

    if (!isSelectMicWhite || cache) return;

    const visibleValue = attributeValuesArr.find(
      (option) => option.visible
    ) as ValueAssetStateI;
    if (!visibleValue) return;

    const qtyMicPod = this.getSelectedValue(AttributeName.QtyMic);
    if (typeof qtyMicPod !== "string") return;

    this.configurator.setConfiguration({
      [AttributeName.RoomMicPendantMount]: {
        assetId: visibleValue.id,
      },
      [AttributeName.QtyMicPendantMount]: qtyMicPod,

      [AttributeName.RoomMicMount]: {
        assetId: "",
      },
      [AttributeName.QtyMicMount]: "0",
    });

    CACHE.set(RuleName.reco_micPendantMount_inWhite, true);
  }

  private rule_reco_micPod_micPodHub() {
    const selectedMic = this.getSelectedValue(AttributeName.RoomMic);
    const selectedMicQty = this.getSelectedValue(AttributeName.QtyMic);
    const selectedMicMount = this.getSelectedValue(AttributeName.RoomMicMount);
    const attribute = this.getAttribute(AttributeName.RoomMicHub);
    if (!attribute) return;
    const attrState = this.configurator.getAttributeState();
    const attributeValuesArr = deepCopy(
      attrState[attribute.id].values
    ) as ValueAssetStateI[];
    if (!attributeValuesArr) return;
    const isSelectMic = typeof selectedMic === "object";
    const isSelectMicMount = typeof selectedMicMount === "object";
    const isRecommendedMicQty =
      typeof selectedMicQty === "string" && parseInt(selectedMicQty) >= 2;
    const isNeedSetRecommended =
      isSelectMic && isRecommendedMicQty && !isSelectMicMount;
    if (isNeedSetRecommended) {
      attributeValuesArr.forEach((option) => {
        this.setRecommendedInMetadata(option, true);
      });
    } else {
      attributeValuesArr.forEach((option) => {
        this.setRecommendedInMetadata(option, false);
      });
    }
    this.configurator.setAttributeState(attribute.id, {
      values: attributeValuesArr,
    });

    const selectedHub = this.getSelectedValue(AttributeName.RoomMicHub);
    const isSelectHub = typeof selectedHub === "object";

    const isChangeHub = this.triggeredByAttr.includes(AttributeName.RoomMicHub);

    if (!isSelectHub && isChangeHub) {
      CACHE.set(RuleName.reco_micPod_micPodHub, true);
    }

    const cache = CACHE.get(RuleName.reco_micPod_micPodHub);
    if (!isNeedSetRecommended || cache) return;

    const visibleValue = attributeValuesArr.find(
      (option) => option.visible
    ) as ValueAssetStateI;
    if (!visibleValue) return;
    this.configurator.setConfiguration({
      [AttributeName.RoomMicHub]: {
        assetId: visibleValue.id,
      },
      [AttributeName.QtyMicHub]: "1",
    });
  }

  private rule_reco_RallyBar() {
    const attrState = this.getAttrStateDataByName(AttributeName.RoomCamera);
    if (!attrState) return;
    const selectedCamera = this.getSelectedValue(AttributeName.RoomCamera);
    if (typeof selectedCamera !== "object") return;
    const isSelectRallyBar = selectedCamera.name.includes(CameraName.RallyBar);
    const values = deepCopy(attrState.values) as ValueAssetStateI[];
    values.forEach((option) => {
      if (!("name" in option)) return;

      const isRallyBar = option.name.includes(CameraName.RallyBar);
      if (isRallyBar && isSelectRallyBar) {
        this.setRecommendedInMetadata(option, true);
      } else {
        this.setRecommendedInMetadata(option, false);
      }
    });

    this.configurator.setAttributeState(attrState.id, {
      values,
    });
  }

  private rule_reco_RallyPlus() {
    const selectedCamera = this.getSelectedValue(AttributeName.RoomCamera);
    if (typeof selectedCamera !== "object") return;
    const isSelectRallyPlus = selectedCamera.name.includes(
      CameraName.RallyPlus
    );
    const attrState = this.getAttrStateDataByName(AttributeName.RoomCamera);
    if (!attrState) return;
    const values = deepCopy(attrState.values) as ValueAssetStateI[];
    values.forEach((option) => {
      if (!("name" in option)) return;
      const isRallyBar = option.name.includes(CameraName.RallyPlus);
      if (isRallyBar && isSelectRallyPlus) {
        this.setRecommendedInMetadata(option, true);
      } else {
        this.setRecommendedInMetadata(option, false);
      }
    });

    this.configurator.setAttributeState(attrState.id, {
      values,
    });
  }

  private rule_micPodQty_sight() {
    const selectedSight = this.getSelectedValue(AttributeName.RoomSight);
    const isSelectSight = typeof selectedSight === "object";
    if (!isSelectSight) return;

    const attrState = this.getAttrStateDataByName(AttributeName.QtyMic);
    if (!attrState) return;
    const values = deepCopy(attrState.values) as ValueAttributeStateI[];
    const countVisible = values.filter((option) => option.visible).length;
    let tempCount = countVisible;
    values.forEach((option) => {
      if (option.visible) {
        tempCount--;
      }
      if (tempCount === 0) {
        option.visible = false;
      }
    });
    this.configurator.setAttributeState(attrState.id, {
      values,
    });
  }

  private rule_tapQty10_tapIp() {
    const selectedTapIp = this.getSelectedValue(AttributeName.RoomMeetingTapIp);
    const isSelectedTapIp = typeof selectedTapIp === "object";
    if (!isSelectedTapIp) return;

    const qtyTapIp = this.getSelectedValue(AttributeName.QtyMeetingTapIp);
    if (typeof qtyTapIp !== "string") return;
    const countTapIp = parseInt(qtyTapIp);
    const objMounts = {
      [AttributeName.RoomTapTableMount]: AttributeName.QtyTapTableMount,
      [AttributeName.RoomTapRiserMount]: AttributeName.QtyTapRiserMount,
      [AttributeName.RoomTapWallMount]: AttributeName.QtyTapWallMount,
    };
    const selectedMountsData = Object.entries(objMounts).reduce<
      Record<string, number>
    >((acc, currentValue) => {
      const { 0: attrName, 1: qtyName } = currentValue;
      const selectedDataMount = this.getSelectedValue(attrName);
      if (typeof selectedDataMount !== "object") return acc;
      const selectedDataQty = this.getSelectedValue(qtyName);
      if (typeof selectedDataQty !== "string") return acc;

      const attrStateQty = this.getAttrStateDataByName(qtyName);
      if (!attrStateQty) return acc;
      const values = deepCopy(attrStateQty.values) as ValueAssetStateI[];
      values.forEach((option) => {
        const isValue = "value" in option;
        if (isValue && Number(option.value) <= countTapIp) {
          option.visible = true;
        }
      });
      this.configurator.setAttributeState(attrStateQty.id, {
        values,
      });

      acc = {
        ...acc,
        [qtyName]: parseInt(selectedDataQty),
      };

      return acc;
    }, {});

    const changeQtyMount = Object.values(objMounts).find((value) =>
      this.triggeredByAttr.includes(value)
    ) as string;

    const countChangeQtyMount = selectedMountsData[changeQtyMount];
    delete selectedMountsData[changeQtyMount];

    const availableCount = countTapIp - countChangeQtyMount;

    const keys = Object.keys(selectedMountsData);
    if (!keys.length) return;
    if (keys.length === 1) {
      const qtyName = keys[0];
      const count = selectedMountsData[qtyName];
      if (count > availableCount) {
        this.configurator.setConfiguration({
          [qtyName]: availableCount.toString(),
        });
      }
      return;
    }

    const selectedMountsDataArr = Object.entries(selectedMountsData);
    const selectedMountsDataArrLength = selectedMountsDataArr.length;
    const selectedMountsDataArrCopy = deepCopy(selectedMountsDataArr);
    let countAllMount = 0;
    for (let i = 0; i < selectedMountsDataArrLength; i++) {
      const [qtyName, count] = selectedMountsDataArrCopy[i];
      countAllMount += count;
      if (countAllMount > availableCount) {
        const newCount = availableCount - (countAllMount - count);
        this.configurator.setConfiguration({
          [qtyName]: newCount.toString(),
        });
        break;
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
    leadingSpecCharForDefault = "*", // - Symbol of the default value
    leadingSpecCharForRecommended = "r" // - Symbol of the recommended value
  ) {
    const rows = dataTable.data;
    const optionRecommendation: Array<string> = [];
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
        const isDefault = rowValue.indexOf(leadingSpecCharForDefault) === 0;
        const isRecommendedDefault =
          rowValue.indexOf(
            leadingSpecCharForRecommended + leadingSpecCharForDefault
          ) === 0;
        if (isDefault || isRecommendedDefault) {
          const dfOption = isDefault
            ? rowValue.substring(1)
            : rowValue.substring(2);
          if (dfOption) {
            if (optionNames.indexOf(dfOption) < 0) optionNames.push(dfOption);
            attrSpec.defaultValue = dfOption;
            if (dfOption === "None") attrSpec.allowBlank = true;
            if (
              isRecommendedDefault &&
              !optionRecommendation.includes(dfOption)
            ) {
              optionRecommendation.push(dfOption);
            }
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
      const copyAttrValuesArr = deepCopy(theAttrValuesArr) as Array<
        ValueStringStateI | ValueAssetStateI
      >;

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

        if (!isContainName) return;

        let isExist = optionRecommendation.includes(option.name);
        if (!isExist) {
          const name = this.getAssetNameWithoutColor(option.name);
          const separatorColor = getSeparatorItemColor();
          isExist = optionRecommendation.some((recoName) =>
            recoName.includes(`${name}${separatorColor}`)
          );
        }

        if (isExist) {
          this.setRecommendedInMetadata(option, true);
        }
      });

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
    leadingSpecCharForRecommended = "r",
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
              leadingSpecCharForDefault + selectedValue_str ||
            row.value[attrSequenceArr[i]] ===
              leadingSpecCharForRecommended +
                leadingSpecCharForDefault +
                selectedValue_str
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
        leadingSpecCharForDefault,
        leadingSpecCharForRecommended
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

      const validateAttrSpecByAttrName = validatedAttrSpec[attrName];
      const attrType = validateAttrSpecByAttrName.attrType;
      const defaultValue = validateAttrSpecByAttrName.defaultValue;

      const currentSelectedValue = this.getSelectedValue(attrName);
      const currentSelectedValue_str = currentSelectedValue
        ? typeof currentSelectedValue === "object" && currentSelectedValue.id
          ? currentSelectedValue.id
          : currentSelectedValue
        : "";
      if (setDefaults) {
        setConfig_obj[attrName] =
          attrType === "Asset"
            ? {
                assetId: defaultValue,
              }
            : defaultValue;
      }

      const isAllowBlank = validateAttrSpecByAttrName.allowBlank;
      const validOptionIds = validateAttrSpecByAttrName.validOptionIds;

      const isIntegerString = (str: string) => {
        return /^[0-9]+$/.test(str);
      };

      if (
        //When not allow blank and only one option available set it to that option if it's currently not that value
        (!isAllowBlank &&
          validOptionIds &&
          validOptionIds.length === 1 &&
          !isIntegerString(validOptionIds[0]) &&
          currentSelectedValue_str !== validOptionIds[0]) ||
        //When allow blank and only one option is blank, set it to blank if it's currently not blank
        (isAllowBlank &&
          validOptionIds.length === 0 &&
          currentSelectedValue_str)
      ) {
        const setToVal = validOptionIds[0] ? validOptionIds[0] : "";
        setConfig_obj[attrName] =
          attrType === "Asset"
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
    leadingSpecCharForRecommended = "r",
    skipColumns: Array<string> = [],
    level1AttrSequenceArr: Array<string> = [],
    currentIndexInLevel1Sequence: number
  ) {
    const setConfig_obj = this.validateAttributesWithDatatable(
      localeTagStr,
      dataTable,
      leadingSpecCharForDefault,
      leadingSpecCharForRecommended,
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
            leadingSpecCharForRecommended,
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
    leadingSpecCharForDefault = "*",
    leadingSpecCharForRecommended = "r"
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
            rowValue ===
              leadingSpecCharForDefault + selectedValueArr[attrIndex] ||
            rowValue ===
              leadingSpecCharForRecommended +
                leadingSpecCharForDefault +
                selectedValueArr[attrIndex]
          )
            found_counter++;
        }
      });

      if (found_counter === attrSequenceArr.length) return row;
    }
    return undefined;
  }

  private getColorFromAssetName(name: string) {
    const colorSeparator = getSeparatorItemColor();
    const color = name.split(colorSeparator)[1];
    return color;
  }

  private getAssetNameWithoutColor(name: string) {
    const colorSeparator = getSeparatorItemColor();
    return name.split(colorSeparator)[0];
  }

  private setRecommendedInMetadata(
    value: ValueAttributeStateI,
    isRecommended: boolean
  ) {
    this.setDataInMetadata(
      value,
      "isRecommended",
      isRecommended ? "true" : "false"
    );
  }

  private setDataInMetadata(
    value: ValueAttributeStateI,
    key: string,
    data: string
  ) {
    if ("value" in value) return;
    value.metadata[key] = data;
  }

  private getAttrStateDataByName(name: string) {
    const attribute = this.getAttribute(name);
    if (!attribute) return;
    const attrState = this.configurator.getAttributeState();
    const attributeValuesArr = attrState[attribute.id].values;

    return {
      id: attribute.id,
      values: attributeValuesArr,
    };
  }

  private limitValuesAttrByCallback = (
    attributeValuesArr: ValueAttributeStateI[],
    attrId: string,
    callback: (currentCount: number, option?: ValueAttributeStateI) => boolean
  ) => {
    let tempCount = 0;
    attributeValuesArr.forEach((option) => {
      const isVisible = callback(tempCount, option);
      option.visible = isVisible;
      tempCount += 1;
    });
    this.configurator.setAttributeState(attrId, {
      values: attributeValuesArr,
    });
  };

  private isSelectRallyPlus() {
    const selectedCamera = this.getSelectedValue(AttributeName.RoomCamera);
    const isSelectCamera = typeof selectedCamera === "object";
    const isSelectRallyPlus =
      isSelectCamera && selectedCamera.name.includes(CameraName.RallyPlus);
    return isSelectRallyPlus;
  }

  private getQtyMicForMounts = () => {
    const qtyMicPod = this.getSelectedValue(AttributeName.QtyMic);
    if (typeof qtyMicPod !== "string") return 0;
    const count = parseInt(qtyMicPod);
    return count;
  };
}
