import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { Configurator } from "../../../../models/configurator/Configurator";
import { AssetI } from "../../../../services/Threekit/type";
import {
  ConfiguratorDataValueType,
  ValueAssetStateI,
  ValueAttributeStateI,
  ValueStringStateI,
} from "../../../../models/configurator/type";
import {
  ColorItemI,
  ItemCardI,
  PlatformCardI,
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
  changeActiveCard,
  changeActiveStep,
  changeProcessInitData,
  changeValueCard,
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

declare const app: Application;

export const getUiHandlers = (store: Store) => {
  app.eventEmitter.on("processInitThreekitData", (data: boolean) => {
    store.dispatch(changeProcessInitData(data));
  });

  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand) {
      const card = getCardByAssetId(data.assetId, store);
      if (card) {
        store.dispatch(changeActiveCard(card));
      }
    }

    if (data instanceof RemoveItemCommand) {
      store.dispatch(changeActiveCard(undefined));
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

    if (data instanceof ChangeStepCommand) {
      const configurator = app.currentConfigurator;
      if (data.stepName === StepName.Platform) {
        setPlatformData(configurator)(store);
      }
      if (data.stepName === StepName.Services) {
        setServiceData(configurator)(store);
      }
      if (data.stepName === StepName.AudioExtensions) {
        setAudioExtensionsData(configurator)(store);
      }
      if (data.stepName === StepName.ConferenceCamera) {
        setCameraData(configurator)(store);
      }
      if (data.stepName === StepName.MeetingController) {
        setMeetingControllerData(configurator)(store);
      }
      if (data.stepName === StepName.VideoAccessories) {
        setVideoAccessoriesData(configurator)(store);
      }
      if (data.stepName === StepName.SoftwareServices) {
        setSoftwareServicesData(configurator)(store);
      }

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

const getCardByAssetId = (assetId: string, store: Store) => {
  const activeStep = store.getState().ui.activeStep;
  if (activeStep) {
    const index = activeStep.cards.findIndex(
      (item: ItemCardI) => item.threekit?.assetId === assetId
    );
    if (index !== -1) {
      return activeStep.cards[index];
    }
  }
};

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
        keyPermission: getPermissionNameByItemName(asset.name),
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
          }
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
      const value = configurator.getAttributeByName(name);
      if (!value) {
        return;
      }

      const temp: Array<ItemCardI> = [];

      if (name.includes("Support")) {
        const baseCard = softwareServicesBaseData.find((item) =>
          item.title.includes("Support")
        );

        const values: Array<string> = [];
        value.values.forEach((item: ConfiguratorDataValueType) => {
          const asset = item as AssetI;
          const plan = asset.metadata["Service Plan"];
          if (plan) {
            values.push(plan);
          }
        });

        if (baseCard) {
          temp.push({
            ...baseCard,
            select: {
              value: {
                label: values[0],
                value: values[0],
              },
              data: values.map((item: string) => {
                return {
                  label: item,
                  value: item,
                };
              }),
            },
          });
        }
      } else if (name.includes("Management")) {
        const baseCard = softwareServicesBaseData.find((item) =>
          item.title.includes("Management")
        );
        if (baseCard) {
          temp.push(baseCard);
        }
      } else {
        value.values.forEach((item: ConfiguratorDataValueType) => {
          const asset = item as AssetI;
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
