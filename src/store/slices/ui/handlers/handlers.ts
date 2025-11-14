import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { Configurator } from "../../../../models/configurator/Configurator";
import {
  AttributeStateI,
  ValueAssetStateI,
  ValueAttributeStateI,
  ValueStringStateI,
} from "../../../../models/configurator/type";
import {
  CardI,
  SelectDataI,
  TypeCardPermissionWithDataThreekit,
} from "../type";
import {
  addActiveCard,
  addActiveCards,
  changeActiveStep,
  changeDisplayType,
  changeProcessInitData,
  clearAllActiveCardsSteps,
  createItem,
  removeActiveCard,
  removeActiveCards,
  setActiveCardsForStep,
  setDataCardsStep,
  setPropertyItem,
} from "../Ui.slice";
import { AddItemCommand } from "../../../../models/command/AddItemCommand";
import { ChangeCountItemCommand } from "../../../../models/command/ChangeCountItemCommand";
import { ChangeColorItemCommand } from "../../../../models/command/ChangeColorItemCommand";
import {
  getPermissionNameByItemName,
  getSortedKeyPermissions,
  isEssentialService,
  getTVMountNameBySettings,
  isCameraElement,
  isExtendWarranty,
  isSupportService,
  isCameraMountElement,
  TVName,
} from "../../../../utils/permissionUtils";
import { RemoveItemCommand } from "../../../../models/command/RemoveItemCommand";
import {
  getColorsData,
  getPlatformCardData,
  getServicesCardData,
  getSoftwareServicesCardData,
} from "../utils";
import {
  changeAssetId,
  setEnabledDimension,
} from "../../configurator/Configurator.slice";
import { ChangeStepCommand } from "../../../../models/command/ChangeStepCommand";
import { ChangeSelectItemCommand } from "../../../../models/command/ChangeSelectItemCommand";
import {
  getActiveStep,
  getActiveStepData,
  getAssetFromCard,
  getCardByKeyPermission,
  getDataStepByName,
  getDisplayType,
  getLocale,
  getPermission,
  getPositionStepNameBasedOnActiveStep,
  getProductNameFromMetadata,
  getPropertyCardByKeyPermission,
  getPropertyDisplayCardByKeyPermission,
  getPropertySelectValueCardByKeyPermission,
  getSelectData,
  getSelectedCardsByStep,
  getStepNameByKeyPermission,
  getSubCardsKeyPermissionStep,
} from "../selectors/selectors";
import { getPropertyColorCardByKeyPermission } from "../selectors/selectorsColorsCard";
import {
  changeColorItem,
  changeCountItem,
  changeDisplayItem,
} from "../actions/actions";
import { Permission } from "../../../../models/permission/Permission";
import { getRoomAssetId } from "../../../../utils/threekitUtils";
import { getSeparatorItem, StepName } from "../../../../utils/baseUtils";
import { EventDataAnalyticsI } from "../../../../models/analytics/type";
import { getDataEvent } from "../selectors/selectorsAnalytics";
import { getTKAnalytics } from "../../../../utils/getTKAnalytics";
import {
  deleteNodesByCards,
  removeElement,
} from "../../configurator/handlers/handlers";
import { getExclusionServiceByLocale } from "../../../../utils/productUtils";
import { ChangeDisplayItemCommand } from "../../../../models/command/ChangeDisplayItemCommand";
import deviceCardsConfig from "../../../../config/deviceCards.json";
import { registerDevicesFromConfig } from "../../../../utils/deviceCardConfig";

declare const app: Application;

export const getUiHandlers = (store: Store) => {
  app.eventEmitter.on("processInitThreekitData", (data: boolean) => {
    store.dispatch(changeProcessInitData(data));
  });

  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand) {
      store.dispatch(addActiveCard({ key: data.keyItemPermission }));
    }

    if (data instanceof RemoveItemCommand) {
      store.dispatch(removeActiveCard({ key: data.keyItemPermission }));
    }

    if (data instanceof ChangeCountItemCommand) {
      const value = parseInt(data.value);
      store.dispatch(changeCountItem({ key: data.keyItemPermission, value }));
    }

    if (data instanceof ChangeColorItemCommand) {
      store.dispatch(
        changeColorItem({
          key: data.keyItemPermission,
          value: data.value,
        })
      );
    }

    if (data instanceof ChangeDisplayItemCommand) {
      store.dispatch(
        changeDisplayItem({ key: data.keyItemPermission, value: data.value })
      );
    }

    if (data instanceof ChangeSelectItemCommand) {
      const state = store.getState();
      const stepName = getActiveStep(state);
      changeSelectItem(data.keyItemPermission, data.assetId, stepName)(store);
    }

    if (data instanceof ChangeStepCommand) {
      store.dispatch(changeActiveStep(data.stepName));
    }
  });

  app.eventEmitter.on(
    "analyticsEvent",
    (data: Omit<EventDataAnalyticsI, "locale">) => {
      const eventData = getDataEvent(
        data.category,
        data.action,
        data.value
      )(store.getState());
      analytics.notify(eventData);
    }
  );

  app.eventEmitter.on(
    "threekitDataInitialized",
    (configurator: Configurator) => {
      store.dispatch(
        clearAllActiveCardsSteps({
          ignoreSteps: [StepName.RoomSize],
          clearProperty: true,
        })
      );
      setAudioExtensionsData(configurator)(store);
      setCameraData(configurator)(store);
      setMeetingControllerData(configurator)(store);
      setVideoAccessoriesData(configurator)(store);
      setSoftwareServicesData(configurator)(store);
      setPlatformData(configurator)(store);
      setServiceData(configurator)(store);

      registerDevicesFromConfig(store, deviceCardsConfig.devices);

      store.dispatch(changeAssetId(configurator.assetId));
      store.dispatch(setEnabledDimension(false));
    }
  );
};

export const changeSelectItem = (
  keyItemPermission: string,
  assetId: string,
  stepName: StepName
) => {
  return (store: Store) => {
    const state = store.getState();
    const card = getCardByKeyPermission(stepName, keyItemPermission)(state);
    const selectValue = getPropertySelectValueCardByKeyPermission(
      stepName,
      keyItemPermission
    )(state);
    const activeStepData = getActiveStepData(state);
    const subCardKeyPermissions =
      getSubCardsKeyPermissionStep(activeStepData)(state);

    store.dispatch(
      setPropertyItem({
        step: stepName,
        keyItemPermission: keyItemPermission,
        property: {
          select: assetId,
        },
      })
    );

    if (!selectValue) {
      app.addItemConfiguration(
        card.dataThreekit.attributeName,
        assetId,
        keyItemPermission
      );
    }

    const parentKeyPermission = Object.entries(subCardKeyPermissions).find(
      (values) => values[1].includes(keyItemPermission)
    )?.[0];

    if (parentKeyPermission) {
      const card = getCardByKeyPermission(stepName, parentKeyPermission)(state);
      const asset = getAssetFromCard(card)(state);
      app.addItemConfiguration(
        card.dataThreekit.attributeName,
        asset.id,
        parentKeyPermission
      );
    }
  };
};

export const updateDisplayTypeByKeyPermission = (
  keyPermission: string,
  stepName: StepName
) => {
  return (store: Store) => {
    if (stepName !== StepName.ConferenceCamera) return;
    if (!isCameraElement(keyPermission)) return;
    const state = store.getState();
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    const element = step.getElementByName(keyPermission);
    if (element?.getHiddenDisplay()) {
      setDefaultsDisplay(stepName)(store);
      return;
    }

    const displayType = getPropertyDisplayCardByKeyPermission(
      stepName,
      keyPermission
    )(state);

    if (!displayType) return;
    store.dispatch(changeDisplayType(displayType));
  };
};

export const setDefaultsDisplay = (stepName: StepName) => {
  return (store: Store) => {
    const state = store.getState();
    if (stepName !== StepName.ConferenceCamera) return;

    const displayName = getDisplayType(state);
    if (displayName) {
      const permission = getPermission(stepName)(state);
      const activeElements = permission.getActiveElements();
      const cameraElement = activeElements.find((item) =>
        isCameraElement(item.name)
      );
      if (cameraElement && !cameraElement.getHiddenDisplay()) {
        return;
      }
    }

    const selectData = getSelectData(state);
    const keyPermissions = [StepName.RoomSize, StepName.Platform].map((key) => {
      const data = selectData[key];
      return Object.values(data).find((item) => item.selected.length > 0)
        ?.selected[0];
    });
    const { 0: keyPermissionRoom, 1: keyPermissionPlatform } = keyPermissions;
    if (!keyPermissionRoom || !keyPermissionPlatform) return;
    const tvMountName = getTVMountNameBySettings(
      keyPermissionRoom,
      keyPermissionPlatform
    );

    store.dispatch(changeDisplayType(tvMountName));
  };
};

export const updateDisplayBasedOnRecommendation = (
  keyPermission: string,
  stepName: StepName
) => {
  return (store: Store) => {
    if (stepName !== StepName.ConferenceCamera) return;
    const skipElement = !isCameraMountElement(keyPermission);
    if (skipElement) return;

    const state = store.getState();
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    const element = step.getElementByName(keyPermission);
    if (!element) return;

    const itemElement = step.getActiveItemElementByMountName(element.name);
    if (!itemElement) return;
    const recommendedDisplay = element.getRecommendedDisplay();
    const keys = Object.keys(recommendedDisplay);
    const activeKeys = keys.filter((key) => recommendedDisplay[key]);
    if (activeKeys.length > 1 || !activeKeys.length) return;

    const displayName = activeKeys[0] as TVName;

    store.dispatch(
      changeDisplayItem({ key: itemElement.name, value: displayName })
    );
  };
};

export const updateColorForAutoChangeItems = (
  stepName: StepName,
  keyPermission: string
) => {
  return (store: Store) => {
    const state = store.getState();
    const permission = getPermission(stepName)(state);
    const color = getPropertyColorCardByKeyPermission(
      stepName,
      keyPermission
    )(state);

    if (!color) return;
    Object.entries(permission.getItemsNeedChange(keyPermission)).forEach(
      ([key, arr]) => {
        if (!arr.includes("color")) return;
        const stepElement = getStepNameByKeyPermission(key)(state);
        if (!stepElement) return;
        store.dispatch(
          setPropertyItem({
            step: stepElement,
            keyItemPermission: key,
            property: {
              color: color,
            },
          })
        );
      }
    );
  };
};

export const updateDisplayForAutoChangeItems = (
  stepName: StepName,
  keyPermission: string
) => {
  return (store: Store) => {
    updatePropertyForAutoChangeItems(stepName, keyPermission, ["display"])(
      store
    );
  };
};

export const updatePropertyForAutoChangeItems = (
  stepName: StepName,
  keyPermission: string,
  property: string[]
) => {
  return (store: Store) => {
    const state = store.getState();
    const permission = getPermission(stepName)(state);
    const itemsNeedChange = permission.getItemsNeedChange(keyPermission);
    const propertyCard = getPropertyCardByKeyPermission(
      stepName,
      keyPermission
    )(state);

    if (!Object.keys(propertyCard).length) return;

    Object.entries(itemsNeedChange).forEach(([key, arr]) => {
      const existProperty = property.filter((item) => arr.includes(item));
      if (!existProperty.length) return;
      const stepElement = getStepNameByKeyPermission(key)(state);
      if (!stepElement) return;

      const updateProperty = existProperty.reduce((acc, item) => {
        const data = propertyCard[item];
        if (!data) return acc;
        acc[item] = data;
        return acc;
      }, {} as Record<string, string>);

      if (!Object.keys(updateProperty).length) return;
      store.dispatch(
        setPropertyItem({
          step: stepElement,
          keyItemPermission: key,
          property: {
            ...updateProperty,
          },
        })
      );
    });
  };
};

export const updateAssetIdByKeyPermission = (keyPermission: string) => {
  return (store: Store) => {
    const state = store.getState();
    const activeStep = getActiveStep(state);
    if (activeStep !== StepName.RoomSize) return;
    const card = getCardByKeyPermission(activeStep, keyPermission)(state);
    if (!card) return;
    const roomAssetId = getRoomAssetId(keyPermission);
    app.currentConfigurator.assetId = roomAssetId;
  };
};

export function updateActiveCardsByPermissionData(permission: Permission) {
  return (store: Store) => {
    const state = store.getState();
    const dataForAdd = permission.getDataForAdd();
    const dataForRemove = permission.getDataForRemove();
    Object.entries(dataForAdd).forEach(([key, arr]) => {
      const position = getPositionStepNameBasedOnActiveStep(key as StepName)(
        state
      );
      if (position === "next") return;
      store.dispatch(addActiveCards({ step: key as StepName, keys: arr }));
    });
    Object.entries(dataForRemove).forEach(([key, arr]) => {
      const position = getPositionStepNameBasedOnActiveStep(key as StepName)(
        state
      );
      if (position === "next") return;
      store.dispatch(removeActiveCards({ step: key as StepName, keys: arr }));
    });
  };
}

export function updateDataCardByStepName(stepName: StepName) {
  return (store: Store, configurator: Configurator) => {
    const updateDataCard = updateDataByConfiguration(configurator, stepName);
    if (stepName === StepName.Platform) {
      setPlatformData(configurator)(store);
      updateDataCard(store, Configurator.PlatformName);
    }
    if (stepName === StepName.Services) {
      setServiceData(configurator)(store);
      updateDataCard(store, Configurator.ServicesName);
    }
    if (stepName === StepName.AudioExtensions) {
      setAudioExtensionsData(configurator)(store);
      updateDataCard(store, Configurator.AudioExtensionName);
    }
    if (stepName === StepName.ConferenceCamera) {
      setCameraData(configurator)(store);
      updateDataCard(store, Configurator.CameraName);
    }
    if (stepName === StepName.MeetingController) {
      setMeetingControllerData(configurator)(store);
      updateDataCard(store, Configurator.MeetingControllerName);
    }
    if (stepName === StepName.VideoAccessories) {
      setVideoAccessoriesData(configurator)(store);
      updateDataCard(store, Configurator.VideoAccessoriesName);
    }
    if (stepName === StepName.SoftwareServices) {
      setSoftwareServicesData(configurator)(store);
      updateDataCard(store, Configurator.SoftwareServicesName);
    }
  };
}

function updateDataByConfiguration(
  configurator: Configurator,
  stepName: StepName
) {
  return (store: Store, arrayAttributes: Array<Array<string>>) => {
    const configuration = configurator.getConfiguration();

    const state = store.getState();
    const stepData = getDataStepByName(stepName)(state);
    const cards: Record<string, CardI> = stepData.cards;
    const activeKeys: string[] = [];

    getTKAnalytics().stage({ stageName: stepName });

    arrayAttributes.forEach((item) => {
      const [name, qtyName] = item;
      const value = configuration[name];

      if (typeof value !== "object") {
        return;
      }

      const tempCard = Object.values(cards).find(
        (item) => getAssetFromCard(item)(state).id === value.assetId
      );

      if (!tempCard) {
        return;
      }

      const keyPermission = tempCard.keyPermission;

      activeKeys.push(keyPermission);

      if (qtyName) {
        const qty = configuration[qtyName];
        if (!qty || !(typeof qty === "string")) return;
        const currentValue = parseInt(qty);
        store.dispatch(
          setPropertyItem({
            step: stepName,
            keyItemPermission: keyPermission,
            property: {
              count: currentValue,
            },
          })
        );
      }
    });

    const selectedCardsByStep = getSelectedCardsByStep(stepName)(state);
    selectedCardsByStep.forEach((cardItem) => {
      const isExist = activeKeys.some((key) => key === cardItem.keyPermission);
      if (!isExist) {
        removeElement(cardItem, stepName)(store);
      }
    });

    store.dispatch(
      setActiveCardsForStep({
        step: stepName,
        keyCards: activeKeys,
        clear: true,
      })
    );
  };
}

function setStepData(
  configurator: Configurator,
  store: Store,
  stepName:
    | StepName.ConferenceCamera
    | StepName.AudioExtensions
    | StepName.MeetingController
    | StepName.VideoAccessories
    | StepName.SoftwareServices,
  itemNameList: Array<Array<string>>
) {
  const stepCardData: Array<CardI> = [];

  itemNameList.forEach((item) => {
    const [name, qtyName] = item;
    const value = configurator.getStateAttributeByName(name);
    if (!value) {
      return;
    }

    const cardPermissionWithDataThreekit: TypeCardPermissionWithDataThreekit =
      getCardPermissionWithDataThreekit(value);

    const temp: Array<CardI> = [];

    Object.keys(cardPermissionWithDataThreekit).forEach((keyPermission) => {
      temp.push({
        key: stepName,
        keyPermission: keyPermission,
        dataThreekit: {
          attributeName: name,
          threekitItems: cardPermissionWithDataThreekit[keyPermission],
        },
      });
    });

    if (qtyName) {
      const qty = configurator.getStateAttributeByName(qtyName);
      if (!qty) return;
      temp.forEach((item) => {
        let min = 0;
        let max = 0;
        const values = (qty.values as Array<ValueStringStateI>).filter(
          (item) => item.visible
        );
        if (values.length) {
          min = parseInt(values[0].value);
          max = parseInt(values[values.length - 1].value);
        }

        item.counter = {
          min: min,
          max: max,
          threekit: {
            key: qtyName,
          },
        };

        const valueConfiguration = configurator.getConfiguration()[
          qtyName
        ] as string;
        const currentValue = valueConfiguration
          ? parseInt(valueConfiguration)
          : min;

        store.dispatch(
          setPropertyItem({
            step: stepName,
            keyItemPermission: item.keyPermission,
            property: {
              count: currentValue,
            },
          })
        );
      });
    }

    stepCardData.push(...temp);
  });

  const state = store.getState();

  stepCardData.forEach((tempCard) => {
    const { threekitItems } = tempCard.dataThreekit;

    const color = getPropertyColorCardByKeyPermission(
      stepName,
      tempCard.keyPermission
    )(state);

    const colorsName = getColorsData().map((item) => item.name);
    const nameItems = Object.keys(threekitItems);
    const includeColors = colorsName.filter((item) =>
      nameItems.some((name) => name.includes(item))
    );
    const isSetColors = includeColors.length && !color;
    if (isSetColors) {
      store.dispatch(
        setPropertyItem({
          step: stepName,
          keyItemPermission: tempCard.keyPermission,
          property: {
            color: includeColors[0],
          },
        })
      );
    } else {
      store.dispatch(
        createItem({
          step: stepName,
          keyItemPermission: tempCard.keyPermission,
        })
      );
    }
  });

  const sortedKeyPermissions = getSortedKeyPermissionsByStep(stepName)(store);
  const sortedCards = sortedCardsByArrTemplate(
    stepCardData,
    sortedKeyPermissions
  );

  removeNodesForNotValidCards(stepName, sortedCards)(store);

  setDataCard(sortedCards, stepName)(store);
}

function setAudioExtensionsData(configurator: Configurator) {
  return (store: Store) => {
    setStepData(
      configurator,
      store,
      StepName.AudioExtensions,
      Configurator.AudioExtensionName
    );
  };
}

function setCameraData(configurator: Configurator) {
  return (store: Store) => {
    setStepData(
      configurator,
      store,
      StepName.ConferenceCamera,
      Configurator.CameraName
    );
  };
}

function setMeetingControllerData(configurator: Configurator) {
  return (store: Store) => {
    setStepData(
      configurator,
      store,
      StepName.MeetingController,
      Configurator.MeetingControllerName
    );
  };
}

function setVideoAccessoriesData(configurator: Configurator) {
  return (store: Store) => {
    setStepData(
      configurator,
      store,
      StepName.VideoAccessories,
      Configurator.VideoAccessoriesName
    );
  };
}

function setStepDataPrepareCard(
  configurator: Configurator,
  store: Store,
  baseData: Array<Omit<CardI, "dataThreekit">>,
  stepName: StepName.Platform | StepName.Services,
  itemNameList: Array<Array<string>>
) {
  const cardData: Array<CardI> = [];

  itemNameList.forEach((item) => {
    const [name] = item;
    const value = configurator.getStateAttributeByName(name);
    if (!value) {
      return;
    }

    const cardPermissionWithDataThreekit: TypeCardPermissionWithDataThreekit =
      getCardPermissionWithDataThreekit(value);

    Object.keys(cardPermissionWithDataThreekit).forEach((keyPermission) => {
      const baseCard = baseData.find(
        (item) => item.keyPermission === keyPermission
      );

      if (!baseCard) return;

      cardData.push({
        ...baseCard,
        dataThreekit: {
          attributeName: name,
          threekitItems: cardPermissionWithDataThreekit[keyPermission],
        },
      });
    });
  });

  cardData.forEach((tempCard) => {
    store.dispatch(
      createItem({
        step: stepName,
        keyItemPermission: tempCard.keyPermission,
      })
    );
  });

  const sortedKeyPermissions = getSortedKeyPermissionsByStep(stepName)(store);
  const sortedCards = sortedCardsByArrTemplate(cardData, sortedKeyPermissions);

  setDataCard(sortedCards, stepName)(store);
}

function setPlatformData(configurator: Configurator) {
  return (store: Store) => {
    setStepDataPrepareCard(
      configurator,
      store,
      Object.values(getPlatformCardData()),
      StepName.Platform,
      Configurator.PlatformName
    );
  };
}

function setServiceData(configurator: Configurator) {
  return (store: Store) => {
    setStepDataPrepareCard(
      configurator,
      store,
      Object.values(getServicesCardData()),
      StepName.Services,
      Configurator.ServicesName
    );
  };
}

function setSoftwareServicesData(configurator: Configurator) {
  return (store: Store) => {
    const softwareServicesCardData: Array<CardI> = [];
    const softwareServicesBaseData = Object.values(
      getSoftwareServicesCardData()
    );
    Configurator.SoftwareServicesName.forEach((item) => {
      const [name] = item;
      const value = configurator.getStateAttributeByName(name);
      if (!value) {
        return;
      }

      const setSelectCards = (
        baseCard: Omit<CardI, "dataThreekit">,
        value: AttributeStateI
      ) => {
        const values: Array<SelectDataI> = [];
        let threekitItems: Record<string, ValueAssetStateI> = {};
        value.values.forEach((item: ValueAttributeStateI) => {
          const asset = item as ValueAssetStateI;
          if (!asset.visible) return;
          const keyPermission = `${
            baseCard.keyPermission
          }${getSeparatorItem()}${asset.id}`;
          if (!threekitItems[keyPermission]) {
            threekitItems = {
              ...threekitItems,
              [keyPermission]: asset,
            };
          }
          const productName = getProductNameFromMetadata(asset.metadata);
          if (productName) {
            const plan = productName.split("-")[1]?.trim();
            values.push({
              label: plan,
              value: asset.id,
            });
          }
        });

        values.sort((a, b) => {
          // Перевірка чи існують a.label та b.label і присвоєння значення '0', якщо немає
          const aLabel = a.label || "0";
          const bLabel = b.label || "0";

          const aNumber = parseInt(aLabel.split(" ")[0]);
          const bNumber = parseInt(bLabel.split(" ")[0]);

          // const aNumber = parseInt(a.label.split(" ")[0]);
          // const bNumber = parseInt(b.label.split(" ")[0]);

          return aNumber - bNumber;
        });

        softwareServicesCardData.push({
          ...baseCard,
          select: {
            data: values,
          },
          dataThreekit: {
            attributeName: name,
            threekitItems,
          },
        });
        return;
      };

      const isExtended = (name: string) => name.includes("Extended");
      if (isExtended(name)) {
        const baseCard = softwareServicesBaseData.find((item) =>
          isExtendWarranty(item.keyPermission)
        );
        if (!baseCard) return;

        setSelectCards(baseCard, value);
        return;
      }

      const isSupport = (name: string) => name.includes("Support");
      if (isSupport(name)) {
        const baseCard = softwareServicesBaseData.find((item) =>
          isSupportService(item.keyPermission)
        );

        if (!baseCard) return;

        setSelectCards(baseCard, value);
        return;
      }

      const isEssential = (name: string) => name.includes("Essential");
      if (isEssential(name)) {
        const baseCard = softwareServicesBaseData.find((item) =>
          isEssentialService(item.keyPermission)
        );

        if (!baseCard) return;

        setSelectCards(baseCard, value);
        return;
      }

      const cardPermissionWithDataThreekit: TypeCardPermissionWithDataThreekit =
        getCardPermissionWithDataThreekit(value);

      Object.keys(cardPermissionWithDataThreekit).forEach((keyPermission) => {
        const baseCard = softwareServicesBaseData.find(
          (item) => item.keyPermission === keyPermission
        );

        if (!baseCard) return;

        softwareServicesCardData.push({
          ...baseCard,
          dataThreekit: {
            attributeName: name,
            threekitItems: cardPermissionWithDataThreekit[keyPermission],
          },
        });
      });
    });

    softwareServicesCardData.forEach((tempCard) => {
      store.dispatch(
        createItem({
          step: StepName.SoftwareServices,
          keyItemPermission: tempCard.keyPermission,
        })
      );
    });

    const sortedKeyPermissions = getSortedKeyPermissionsByStep(
      StepName.SoftwareServices
    )(store);
    let sortedCards = sortedCardsByArrTemplate(
      softwareServicesCardData,
      sortedKeyPermissions
    );

    const locale = getLocale(store.getState());
    const exclusionServices = getExclusionServiceByLocale(locale);
    if (exclusionServices) {
      sortedCards = sortedCards.filter(
        (card) => !exclusionServices.includes(card.keyPermission)
      );
    }

    setDataCard(sortedCards, StepName.SoftwareServices)(store);
  };
}

function getCardPermissionWithDataThreekit(attribute: AttributeStateI) {
  const cardPermissionWithDataThreekit: TypeCardPermissionWithDataThreekit = {};

  attribute.values.forEach((item: ValueAttributeStateI) => {
    const asset = item as ValueAssetStateI;
    if (!asset.visible) return;
    const keyPermission = getPermissionNameByItemName(asset.name);
    if (!keyPermission) return;

    if (!cardPermissionWithDataThreekit[keyPermission]) {
      cardPermissionWithDataThreekit[keyPermission] = {};
    }

    cardPermissionWithDataThreekit[keyPermission][asset.name] = asset;
  });

  return cardPermissionWithDataThreekit;
}

function setDataCard(cards: Array<CardI>, stepName: StepName) {
  return (store: Store) => {
    const cardsData = cards.reduce((acc, item) => {
      acc[item.keyPermission] = item;
      return acc;
    }, {} as Record<string, CardI>);

    store.dispatch(
      setDataCardsStep({
        step: stepName,
        cards: cardsData,
      })
    );
  };
}

function sortedCardsByArrTemplate(
  cards: Array<CardI>,
  templateArr: Array<string>
) {
  if (templateArr.length === 0) return cards;

  const sortedData = cards.reduce<{
    sorted: Array<CardI | undefined>;
    rest: Array<CardI>;
  }>(
    (acc, item) => {
      const index = templateArr.indexOf(item.keyPermission);
      if (index !== -1) {
        acc.sorted[index] = item;
      } else {
        acc.rest.push(item);
      }
      return acc;
    },
    { sorted: new Array(templateArr.length), rest: [] }
  );

  const sortedCards = sortedData.sorted.filter(Boolean) as Array<CardI>;

  return [...sortedCards, ...sortedData.rest];
}

function getSortedKeyPermissionsByStep(stepName: StepName) {
  return (store: Store) => {
    const state = store.getState();
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    const activeKeys = step
      .getChainActiveElements()
      .flat()
      .map((item) => item.name);
    return getSortedKeyPermissions(stepName, activeKeys);
  };
}

function removeNodesForNotValidCards(
  stepName: StepName,
  newCards: Array<CardI>
) {
  return (store: Store) => {
    const state = store.getState();
    const selectedCardsByStep = getSelectedCardsByStep(stepName)(state);
    selectedCardsByStep.forEach((cardItem) => {
      const isExist = newCards.some(
        (item) => item.keyPermission === cardItem.keyPermission
      );
      if (!isExist) {
        deleteNodesByCards([cardItem])(store);
      }
    });
  };
}
