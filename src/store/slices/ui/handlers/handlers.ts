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
  StepName,
  TypeCardPermissionWithDataThreekit,
} from "../type";
import MicImg from "../../../../assets/images/items/mic.jpg";
import CameraImg from "../../../../assets/images/items/camera.jpg";
import ControllerImg from "../../../../assets/images/items/controller.jpg";
import AccessImg from "../../../../assets/images/items/access.jpg";
import {
  addActiveCard,
  addActiveCards,
  changeActiveStep,
  changeProcessInitData,
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
  SoftwareServicesName,
  getPermissionNameByItemName,
  isSupportService,
} from "../../../../utils/permissionUtils";
import { RemoveItemCommand } from "../../../../models/command/RemoveItemCommand";
import {
  getPlatformCardData,
  getServicesCardData,
  getSoftwareServicesCardData,
} from "../utils";
import { changeAssetId } from "../../configurator/Configurator.slice";
import { ChangeStepCommand } from "../../../../models/command/ChangeStepCommand";
import { ChangeSelectItemCommand } from "../../../../models/command/ChangeSelectItemCommand";
import {
  getActiveStep,
  getAssetFromCard,
  getDataStepByName,
  getPositionStepNameBasedOnActiveStep,
} from "../selectors/selectors";
import { getPropertyColorCardByKeyPermission } from "../selectors/selectorsColorsCard";
import { changeColorItem, changeCountItem } from "../actions/actions";
import { Permission } from "../../../../models/permission/Permission";

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
      const activeStep = getActiveStep(store.getState());
      store.dispatch(
        setPropertyItem({
          step: activeStep,
          keyItemPermission: data.keyItemPermission,
          property: {
            select: data.assetId,
          },
        })
      );
    }

    if (data instanceof ChangeStepCommand) {
      store.dispatch(changeActiveStep(data.stepName));
    }
  });

  app.eventEmitter.on(
    "threekitDataInitialized",
    (configurator: Configurator) => {
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
    console.log("stepName", stepName);

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
      setActiveCardsForStep({ step: stepName, keyCards: activeKeys })
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
  itemNameList: Array<Array<string>>,
  image: string,
  subtitle?: string
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
        image: image,
        subtitle: subtitle,
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
        const values = (qty.values as Array<ValueStringStateI>).filter(
          (item) => item.visible
        );
        let min = 0;
        let max = 0;
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

  stepCardData.forEach((tempCard) => {
    const { threekitItems } = tempCard.dataThreekit;

    const color = getPropertyColorCardByKeyPermission(
      stepName,
      tempCard.keyPermission
    )(store.getState());

    //temp solution, but need to be refactored, because threekitItems can include isn't color items (Object.keys(threekitItems).length === 2)
    const isSetColors = Object.keys(threekitItems).length === 2 && !color;
    if (isSetColors) {
      store.dispatch(
        setPropertyItem({
          step: stepName,
          keyItemPermission: tempCard.keyPermission,
          property: {
            color: "Graphite",
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

  setDataCard(stepCardData, stepName)(store);
}

function setAudioExtensionsData(configurator: Configurator) {
  return (store: Store) => {
    setStepData(
      configurator,
      store,
      StepName.AudioExtensions,
      Configurator.AudioExtensionName,
      MicImg,
      undefined
    );
  };
}

function setCameraData(configurator: Configurator) {
  return (store: Store) => {
    setStepData(
      configurator,
      store,
      StepName.ConferenceCamera,
      Configurator.CameraName,
      CameraImg,
      undefined
    );
  };
}

function setMeetingControllerData(configurator: Configurator) {
  return (store: Store) => {
    setStepData(
      configurator,
      store,
      StepName.MeetingController,
      Configurator.MeetingControllerName,
      ControllerImg,
      "Minimum (1)"
    );
  };
}

function setVideoAccessoriesData(configurator: Configurator) {
  return (store: Store) => {
    setStepData(
      configurator,
      store,
      StepName.VideoAccessories,
      Configurator.VideoAccessoriesName,
      AccessImg
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

  setDataCard(cardData, stepName)(store);
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
          const plan = asset.metadata["Service Plan"];
          if (plan) {
            values.push({
              label: plan,
              value: asset.id,
            });
          }
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
      if (tempCard.select) {
        store.dispatch(
          setPropertyItem({
            step: StepName.SoftwareServices,
            keyItemPermission: tempCard.keyPermission,
            property: {
              select: tempCard.select.data[0].value,
            },
          })
        );
        return;
      }
      store.dispatch(
        createItem({
          step: StepName.SoftwareServices,
          keyItemPermission: tempCard.keyPermission,
        })
      );
    });

    const sortedTemplateArr = [
      SoftwareServicesName.LogitechSync,
      SoftwareServicesName.SupportService,
      SoftwareServicesName.ExtendedWarranty,
    ];
    const sortedArr = sortedTemplateArr
      .map((item) => {
        const card = softwareServicesCardData.find(
          (card) => card.keyPermission === item
        );
        return card;
      })
      .filter(Boolean) as Array<CardI>;

    setDataCard(sortedArr, StepName.SoftwareServices)(store);
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
