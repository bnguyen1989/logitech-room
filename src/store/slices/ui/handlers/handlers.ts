import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { Configurator } from "../../../../models/configurator/Configurator";
import {
  ValueAssetStateI,
  ValueAttributeStateI,
  ValueStringStateI,
} from "../../../../models/configurator/type";
import {
  ColorItemI,
  ItemCardI,
  PlatformCardI,
  SelectDataI,
  ServiceCardI,
  StepCardType,
  StepI,
  StepName,
} from "../type";
import MicImg from "../../../../assets/images/items/mic.jpg";
import CameraImg from "../../../../assets/images/items/camera.jpg";
import ControllerImg from "../../../../assets/images/items/controller.jpg";
import AccessImg from "../../../../assets/images/items/access.jpg";
import ServiceImg from "../../../../assets/images/items/service.jpg";
import {
  addActiveCard,
  changeActiveStep,
  changeProcessInitData,
  changeValueCard,
  removeActiveCard,
  setActiveCardsForStep,
  setDataItemStep,
  setDataPrepareStep,
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

declare const app: Application;

export const getUiHandlers = (store: Store) => {
  app.eventEmitter.on("processInitThreekitData", (data: boolean) => {
    store.dispatch(changeProcessInitData(data));
  });

  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand || data instanceof RemoveItemCommand) {
      const card = getCardByAssetId(data.assetId, store);
      if (card.keyPermission) {
        if (data instanceof AddItemCommand) {
          permission.addActiveElementByName(card.keyPermission);
        }
        if (data instanceof RemoveItemCommand) {
          permission.removeActiveItemByName(card.keyPermission);
        }

        const stepName = store.getState().ui.activeStep?.key;
        if (!stepName) return;
        const configurator = app.currentConfigurator;
        updateDataCardByStepName(stepName)(store, configurator);
        const stepData = store.getState().ui.stepData;
        const listStepData: Array<StepI<StepCardType>> =
          Object.values(stepData);
        const step = listStepData.find(
          (item: StepI<StepCardType>) => item.key === stepName
        );
        if (step) {
          store.dispatch(changeActiveStep(step));
        }
      } else if (card) {
        if (data instanceof AddItemCommand) {
          store.dispatch(addActiveCard(card));
        }
        if (data instanceof RemoveItemCommand) {
          store.dispatch(removeActiveCard(card));
        }
      }
    }

    if (data instanceof ChangeCountItemCommand) {
      const card = getCardByAssetId(data.assetId, store);
      if (card) {
        const value = parseInt(data.value);
        store.dispatch(
          changeValueCard({
            ...card,
            counter: {
              ...card.counter,
              currentValue: value,
            },
          })
        );
      }
    }

    if (data instanceof ChangeColorItemCommand) {
      const card = getCardByAssetId(data.assetId, store);
      if (card) {
        const value = card.color?.colors.find(
          (item: ColorItemI) => item.value === data.value
        );
        store.dispatch(
          changeValueCard({
            ...card,
            color: {
              ...card.color,
              currentColor: value,
            },
          })
        );
      }
    }

    if (data instanceof ChangeSelectItemCommand) {
      const activeStep = store.getState().ui.activeStep;
      if (activeStep) {
        const index = activeStep.cards.findIndex((item: ItemCardI) =>
          item.select?.data.some((vs) => vs.threekit.assetId === data.assetId)
        );
        if (index !== -1) {
          const card = activeStep.cards[index];
          if (card) {
            const value = card.select?.data.find(
              (item: SelectDataI) => item.threekit.assetId === data.assetId
            );
            store.dispatch(
              changeValueCard({
                ...card,
                select: {
                  ...card.select,
                  value,
                },
                threekit: {
                  ...card.threekit,
                  assetId: data.assetId,
                },
              })
            );
          }
        }
      }
    }

    if (data instanceof ChangeStepCommand) {
      permission.changeStepName(data.stepName);
      const configurator = app.currentConfigurator;
      updateDataCardByStepName(data.stepName)(store, configurator);

      const stepData = store.getState().ui.stepData;
      const listStepData: Array<StepI<StepCardType>> = Object.values(stepData);
      const step = listStepData.find(
        (item: StepI<StepCardType>) => item.key === data.stepName
      );
      if (step) {
        store.dispatch(changeActiveStep(step));
      }
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
    const cards: Array<StepCardType> =
      store.getState().ui.stepData[stepName].cards;
    const result: Array<StepCardType> = [];
    arrayAttributes.forEach((item) => {
      const [name, qtyName] = item;
      const value = configuration[name];

      let tempCard;
      if (typeof value === "object") {
        tempCard = cards.find(
          (item) =>
            item.key !== StepName.RoomSize &&
            item.threekit?.assetId === value.assetId
        );
      }

      if (!tempCard) {
        return;
      }

      tempCard = JSON.parse(JSON.stringify(tempCard));

      if (qtyName && "counter" in tempCard) {
        const qty = configuration[qtyName];
        if (!qty || !(typeof qty === "string")) return;
        const currentValue = parseInt(qty);
        if (tempCard.counter) {
          tempCard.counter = {
            ...tempCard.counter,
            currentValue,
          };
        }
      }

      result.push(tempCard);
    });
    result.forEach((item) => {
      if (!item.keyPermission) return;
      permission.addActiveElementByName(item.keyPermission);

      const element = permission
        .getCurrentStep()
        ?.getElementByName(item.keyPermission);
      if (element instanceof ItemElement && "counter" in item) {
        const [mount] = element.getDependenceMount();
        if (mount instanceof CountableMountElement && item.counter) {
          mount.setActiveIndex(item.counter.currentValue);
          mount.setMin(item.counter.min);
          mount.setMax(item.counter.max);
        }
      }
    });
    store.dispatch(setActiveCardsForStep({ key: stepName, cards: result }));
  };
}

function getCardByAssetId(assetId: string, store: Store) {
  const activeStep = store.getState().ui.activeStep;
  if (activeStep) {
    const index = activeStep.cards.findIndex(
      (item: ItemCardI) => item.threekit?.assetId === assetId
    );
    if (index !== -1) {
      return activeStep.cards[index];
    }
  }
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
  subtitle?: string,
  isColor?: boolean
) {
  const stepCardData: Array<ItemCardI> = [];
  itemNameList.forEach((item) => {
    const [name, qtyName] = item;
    const value = configurator.getStateAttributeByName(name);
    if (!value) {
      return;
    }

    const temp: Array<ItemCardI> = [];
    value.values.forEach((item: ValueAttributeStateI) => {
      const asset = item as ValueAssetStateI;
      if (!asset.visible) return;
      const keyPermission = getPermissionNameByItemName(asset.name);
      const elementPermission = permission
        .getElements()
        .find((item) => item.name === keyPermission);

      temp.push({
        key: stepName,
        image: image,
        header_title: asset.name,
        title: asset.name,
        subtitle: subtitle,
        threekit: {
          assetId: asset.id,
          key: name,
        },
        keyPermission: keyPermission,
        recommended: elementPermission?.getRecommended() || false,
        color: !isColor
          ? undefined
          : {
              currentColor: {
                name: "Graphite",
                value: "#434446",
              },
              colors: [
                {
                  name: "Graphite",
                  value: "#434446",
                },
                {
                  name: "White",
                  value: "#FBFBFB",
                },
              ],
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
        const min = parseInt(values[0].value);
        const max = parseInt(values[values.length - 1].value);
        const valueConfiguration = configurator.getConfiguration()[
          qtyName
        ] as string;
        const currentValue = valueConfiguration
          ? parseInt(valueConfiguration)
          : min;

        item.counter = {
          min: min,
          max: max,
          currentValue,
          threekit: {
            key: qtyName,
          },
        };
      });
    }

    stepCardData.push(...temp);
  });

  store.dispatch(
    setDataItemStep({
      key: stepName,
      values: stepCardData,
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
      undefined,
      true
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
      undefined,
      true
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

function setStepDataPrepareCard<T extends PlatformCardI | ServiceCardI>(
  configurator: Configurator,
  store: Store,
  baseData: Array<T>,
  stepName: StepName.Platform | StepName.Services,
  itemNameList: Array<Array<string>>
) {
  const cardData: Array<T> = [];

  itemNameList.forEach((item) => {
    const [name] = item;
    const value = configurator.getStateAttributeByName(name);
    if (!value) {
      return;
    }

    value.values.forEach((item: ValueAttributeStateI) => {
      const asset = item as ValueAssetStateI;
      const baseCard = baseData.find(
        (item) => item.keyPermission === asset.name
      );
      if (!baseCard || !asset.visible) return;
      cardData.push({
        ...baseCard,
        threekit: {
          assetId: asset.id,
          key: name,
        },
      });
    });
  });

  store.dispatch(
    setDataPrepareStep({
      key: stepName,
      values: cardData,
    })
  );
}

function setPlatformData(configurator: Configurator) {
  return (store: Store) => {
    setStepDataPrepareCard(
      configurator,
      store,
      getPlatformCardData(),
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
      getServicesCardData(),
      StepName.Services,
      Configurator.ServicesName
    );
  };
}

function setSoftwareServicesData(configurator: Configurator) {
  return (store: Store) => {
    const softwareServicesCardData: Array<ItemCardI> = [];
    const softwareServicesBaseData = getSoftwareServicesCardData();
    Configurator.SoftwareServicesName.forEach((item) => {
      const [name] = item;
      const value = configurator.getStateAttributeByName(name);
      if (!value) {
        return;
      }

      const temp: Array<ItemCardI> = [];

      const isSupport = (name: string) => name.includes("Support");
      const isManagement = (name: string) => name.includes("Management");

      if (isSupport(name)) {
        const baseCard = softwareServicesBaseData.find((item) =>
          isSupport(item.title)
        );

        const values: Array<SelectDataI> = [];
        value.values.forEach((item: ValueAttributeStateI) => {
          const asset = item as ValueAssetStateI;
          if (!asset.visible) return;
          const plan = asset.metadata["Service Plan"];
          if (plan) {
            values.push({
              label: plan,
              value: plan,
              threekit: {
                assetId: asset.id,
              },
            });
          }
        });

        if (baseCard) {
          temp.push({
            ...baseCard,
            select: {
              value: values[0],
              data: values,
            },
            threekit: {
              assetId: values[0].threekit.assetId,
              key: name,
            },
          });
        }
      } else if (isManagement(name)) {
        const baseCard = softwareServicesBaseData.find((item) =>
          isManagement(item.title)
        );
        value.values.forEach((item: ValueAttributeStateI) => {
          const asset = item as ValueAssetStateI;
          if (asset.visible && baseCard) {
            temp.push({
              ...baseCard,
              threekit: {
                assetId: asset.id,
                key: name,
              },
            });
          }
        });
      } else {
        value.values.forEach((item: ValueAttributeStateI) => {
          const asset = item as ValueAssetStateI;
          temp.push({
            key: StepName.SoftwareServices,
            image: ServiceImg,
            header_title: asset.name,
            title: asset.name,
            threekit: {
              assetId: asset.id,
              key: name,
            },
            keyPermission: getPermissionNameByItemName(asset.name),
          });
        });
      }

      softwareServicesCardData.push(...temp);
    });

    store.dispatch(
      setDataItemStep({
        key: StepName.SoftwareServices,
        values: softwareServicesCardData,
      })
    );
  };
}
