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
  isSupportService,
} from "../../../../utils/permissionUtils";
import { RemoveItemCommand } from "../../../../models/command/RemoveItemCommand";
import {
  getColorsData,
  getPlatformCardData,
  getServicesCardData,
  getSoftwareServicesCardData,
  getSortedKeyPermissionsByStep,
} from "../utils";
import { changeAssetId } from "../../configurator/Configurator.slice";
import { ChangeStepCommand } from "../../../../models/command/ChangeStepCommand";
import { ChangeSelectItemCommand } from "../../../../models/command/ChangeSelectItemCommand";
import {
  getActiveStep,
  getAssetFromCard,
  getCardByKeyPermission,
  getDataStepByName,
  getPositionStepNameBasedOnActiveStep,
  getProductNameFromMetadata,
  getPropertySelectValueCardByKeyPermission,
} from "../selectors/selectors";
import { getPropertyColorCardByKeyPermission } from "../selectors/selectorsColorsCard";
import { changeColorItem, changeCountItem } from "../actions/actions";
import { Permission } from "../../../../models/permission/Permission";
import { getRoomAssetId } from "../../../../utils/threekitUtils";
import { StepName } from "../../../../utils/baseUtils";
import { EventDataAnalyticsI } from "../../../../models/analytics/type";
import { getDataEvent } from "../selectors/selectorsAnalytics";
import { getTKAnalytics } from "../../../../utils/getTKAnalytics";
import { removeElement } from "../../configurator/handlers/handlers";

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

    if (data instanceof ChangeSelectItemCommand) {
      const state = store.getState();
      const activeStep = getActiveStep(state);
      const selectValue = getPropertySelectValueCardByKeyPermission(
        activeStep,
        data.keyItemPermission
      )(state);

      store.dispatch(
        setPropertyItem({
          step: activeStep,
          keyItemPermission: data.keyItemPermission,
          property: {
            select: data.assetId,
          },
        })
      );

      if (!selectValue) {
        app.addItemConfiguration(
          data.nameProperty,
          data.assetId,
          data.keyItemPermission
        );
      }
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
        })
      );
      setAudioExtensionsData(configurator)(store);
      setCameraData(configurator)(store);
      setMeetingControllerData(configurator)(store);
      setVideoAccessoriesData(configurator)(store);
      setSoftwareServicesData(configurator)(store);
      setPlatformData(configurator)(store);
      setServiceData(configurator)(store);
      store.dispatch(changeAssetId(configurator.assetId));
    }
  );
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
      arr.forEach((keyCard) => {
        const card = getCardByKeyPermission(key as StepName, keyCard)(state);
        removeElement(card, key as StepName)(store);
      });
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
    store.dispatch(
      setActiveCardsForStep({
        step: stepName,
        keyCards: activeKeys,
        clear: stepName !== StepName.ConferenceCamera,
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

  const sortedKeyPermissions = getSortedKeyPermissionsByStep(stepName);
  const sortedCards = sortedCardsByArrTemplate(
    stepCardData,
    sortedKeyPermissions
  );

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

  const sortedKeyPermissions = getSortedKeyPermissionsByStep(stepName);
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

      const isSupport = (name: string) => name.includes("Support");
      if (isSupport(name)) {
        const baseCard = softwareServicesBaseData.find((item) =>
          isSupportService(item.keyPermission)
        );

        if (!baseCard) return;

        const values: Array<SelectDataI> = [];
        let threekitItems: Record<string, ValueAssetStateI> = {};
        value.values.forEach((item: ValueAttributeStateI) => {
          const asset = item as ValueAssetStateI;
          if (!asset.visible) return;
          if (!threekitItems[baseCard.keyPermission]) {
            threekitItems = {
              [baseCard.keyPermission]: asset,
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
        
        console.log("value setSoftwareServices", values);

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
    );
    const sortedCards = sortedCardsByArrTemplate(
      softwareServicesCardData,
      sortedKeyPermissions
    );

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
