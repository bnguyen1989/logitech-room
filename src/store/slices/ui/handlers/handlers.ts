import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { Configurator } from "../../../../models/configurator/Configurator";
import {
  ValueAssetStateI,
  ValueAttributeStateI,
  ValueStringStateI,
} from "../../../../models/configurator/type";
import {
  CardI,
  // SelectDataI,
  StepName,
  TypeCardPermissionWithDataThreekit,
} from "../type";
import MicImg from "../../../../assets/images/items/mic.jpg";
import CameraImg from "../../../../assets/images/items/camera.jpg";
import ControllerImg from "../../../../assets/images/items/controller.jpg";
import AccessImg from "../../../../assets/images/items/access.jpg";
// import ServiceImg from "../../../../assets/images/items/service.jpg";
import {
  changeActiveStep,
  changeProcessInitData,
  createItem,
  setActiveCardsForStep,
  setDataCardsStep,
  setPropertyItem,
} from "../Ui.slice";
import { AddItemCommand } from "../../../../models/command/AddItemCommand";
import { ChangeCountItemCommand } from "../../../../models/command/ChangeCountItemCommand";
import { ChangeColorItemCommand } from "../../../../models/command/ChangeColorItemCommand";
import { getPermissionNameByItemName } from "../../../../utils/permissionUtils";
import { RemoveItemCommand } from "../../../../models/command/RemoveItemCommand";
import {
  getPlatformCardData,
  getServicesCardData,
  getSoftwareServicesCardData,
} from "../utils";
import { changeAssetId } from "../../configurator/Configurator.slice";
import { ChangeStepCommand } from "../../../../models/command/ChangeStepCommand";
import { ChangeSelectItemCommand } from "../../../../models/command/ChangeSelectItemCommand";
import { CountableMountElement } from "../../../../models/permission/elements/CountableMountElement";
import { ItemElement } from "../../../../models/permission/elements/ItemElement";
import { getActiveStep, getAssetFromCard, getDataStepByName } from "../selectors/selectors";

declare const app: Application;

export const getUiHandlers = (store: Store) => {
  app.eventEmitter.on("processInitThreekitData", (data: boolean) => {
    store.dispatch(changeProcessInitData(data));
  });

  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand || data instanceof RemoveItemCommand) {
      if (data instanceof AddItemCommand) {
        permission.addActiveElementByName(data.keyItemPermission);
      }
      if (data instanceof RemoveItemCommand) {
        permission.removeActiveItemByName(data.keyItemPermission);
      }

      const stepName = getActiveStep(store.getState());
      const configurator = app.currentConfigurator;
      updateDataCardByStepName(stepName)(store, configurator);
    }

    if (data instanceof ChangeCountItemCommand) {
      const activeStep = getActiveStep(store.getState());
      const value = parseInt(data.value);
      store.dispatch(
        setPropertyItem({
          step: activeStep,
          keyItemPermission: data.keyItemPermission,
          property: {
            count: value,
          },
        })
      );
    }

    if (data instanceof ChangeColorItemCommand) {
      const activeStep = getActiveStep(store.getState());
      store.dispatch(
        setPropertyItem({
          step: activeStep,
          keyItemPermission: data.keyItemPermission,
          property: {
            color: data.value,
          },
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
      permission.changeStepName(data.stepName);
      const configurator = app.currentConfigurator;
      updateDataCardByStepName(data.stepName)(store, configurator);

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

function updateDataCardByStepName(stepName: StepName) {
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

        permission.addActiveElementByName(keyPermission);
        const element = permission
          .getCurrentStep()
          ?.getElementByName(keyPermission);
        if (element instanceof ItemElement && tempCard.counter) {
          const mount = element.getDefaultMount();
          if (mount instanceof CountableMountElement) {
            mount.setActiveIndex(currentValue);
            mount.setMin(tempCard.counter.min);
            mount.setMax(tempCard.counter.max);
          }
        }
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
      {};

    value.values.forEach((item: ValueAttributeStateI) => {
      const asset = item as ValueAssetStateI;
      if (!asset.visible) return;
      const keyPermission = getPermissionNameByItemName(asset.name);
      if (!keyPermission) return;

      if (!cardPermissionWithDataThreekit[keyPermission]) {
        cardPermissionWithDataThreekit[keyPermission] = {};
      }

      cardPermissionWithDataThreekit[keyPermission][asset.name] = asset;
    });

    const temp: Array<CardI> = [];

    Object.keys(cardPermissionWithDataThreekit).forEach((keyPermission) => {
      const elementPermission = permission
        .getElements()
        .find((item) => item.name === keyPermission);

      temp.push({
        key: stepName,
        image: image,
        subtitle: subtitle,
        keyPermission: keyPermission,
        dataThreekit: {
          attributeName: name,
          threekitItems: cardPermissionWithDataThreekit[keyPermission],
        },
        recommended: elementPermission?.getRecommended() || false,
      });
    });

    if (qtyName) {
      const qty = configurator.getStateAttributeByName(qtyName);
      if (!qty) return;
      temp.forEach((item) => {
        const values = (qty.values as Array<ValueStringStateI>).filter(
          (item) => item.visible
        );
        const min = parseInt(values[0].value);
        const max = parseInt(values[values.length - 1].value);

        item.counter = {
          min: min,
          max: max,
          // threekit: { ???????
          //   key: qtyName,
          // },
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
    store.dispatch(
      createItem({
        step: stepName,
        keyItemPermission: tempCard.keyPermission,
      })
    );
  });

  const cards = stepCardData.reduce((acc, item) => {
    acc[item.keyPermission] = item;
    return acc;
  }, {} as Record<string, CardI>);

  store.dispatch(
    setDataCardsStep({
      step: stepName,
      cards,
    })
  );
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
      {};

    value.values.forEach((item: ValueAttributeStateI) => {
      const asset = item as ValueAssetStateI;
      if (!asset.visible) return;
      const keyPermission = getPermissionNameByItemName(asset.name);
      if (!keyPermission) return;

      if (!cardPermissionWithDataThreekit[keyPermission]) {
        cardPermissionWithDataThreekit[keyPermission] = {};
      }

      cardPermissionWithDataThreekit[keyPermission][asset.name] = asset;
    });

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

  const cards = cardData.reduce((acc, item) => {
    acc[item.keyPermission] = item;
    return acc;
  }, {} as Record<string, CardI>);

  store.dispatch(
    setDataCardsStep({
      step: stepName,
      cards,
    })
  );
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

      const temp: Array<CardI> = [];

      // const isSupport = (name: string) => name.includes("Support");
      // const isManagement = (name: string) => name.includes("Management");

      // if (isSupport(name)) {
      //   const baseCard = softwareServicesBaseData.find((item) =>
      //     isSupport(item.title)
      //   );

      //   const values: Array<SelectDataI> = [];
      //   value.values.forEach((item: ValueAttributeStateI) => {
      //     const asset = item as ValueAssetStateI;
      //     if (!asset.visible) return;
      //     const plan = asset.metadata["Service Plan"];
      //     if (plan) {
      //       values.push({
      //         label: plan,
      //         value: asset.id,
      //       });
      //     }
      //   });

      //   if (baseCard) {
      //     temp.push({
      //       ...baseCard,
      //       select: {
      //         data: values,
      //       },
      //       threekit: {
      //         assetId: values[0].value,
      //         key: name,
      //       },
      //     });
      //   }
      // } else if (isManagement(name)) {
      //   const baseCard = softwareServicesBaseData.find((item) =>
      //     isManagement(item.title)
      //   );
      //   value.values.forEach((item: ValueAttributeStateI) => {
      //     const asset = item as ValueAssetStateI;
      //     if (asset.visible && baseCard) {
      //       temp.push({
      //         ...baseCard,
      //         threekit: {
      //           assetId: asset.id,
      //           key: name,
      //         },
      //       });
      //     }
      //   });
      // } else {}
      const cardPermissionWithDataThreekit: TypeCardPermissionWithDataThreekit =
        {};

      value.values.forEach((item: ValueAttributeStateI) => {
        const asset = item as ValueAssetStateI;
        if (!asset.visible) return;
        const keyPermission = getPermissionNameByItemName(asset.name);
        if (!keyPermission) return;

        if (!cardPermissionWithDataThreekit[keyPermission]) {
          cardPermissionWithDataThreekit[keyPermission] = {};
        }

        cardPermissionWithDataThreekit[keyPermission][asset.name] = asset;
      });

      Object.keys(cardPermissionWithDataThreekit).forEach((keyPermission) => {
        const baseCard = softwareServicesBaseData.find(
          (item) => item.keyPermission === keyPermission
        );

        if (!baseCard) return;

        softwareServicesCardData.push({
          ...baseCard,
          dataThreekit: {
            attributeName: name,
            threekitItems: cardPermissionWithDataThreekit[keyPermission]
          },
        });
      });

      softwareServicesCardData.push(...temp);
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
          keyItemPermission: tempCard.keyPermission ?? "",
        })
      );
    });

    const cards = softwareServicesCardData.reduce((acc, item) => {
      acc[item.keyPermission] = item;
      return acc;
    }, {} as Record<string, CardI>);

    store.dispatch(
      setDataCardsStep({
        step: StepName.SoftwareServices,
        cards,
      })
    );
  };
}
