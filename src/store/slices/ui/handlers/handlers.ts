import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { Configurator } from "../../../../models/configurator/Configurator";
import { AssetI } from "../../../../services/Threekit/type";
import { ConfiguratorDataValueType } from "../../../../models/configurator/type";
import { ColorItemI, ItemCardI, StepName } from "../type";
import MicImg from "../../../../assets/images/items/mic.jpg";
import CameraImg from "../../../../assets/images/items/camera.jpg";
import ControllerImg from "../../../../assets/images/items/controller.jpg";
import AccessImg from "../../../../assets/images/items/access.jpg";
import ServiceImg from "../../../../assets/images/items/service.jpg";
import {
  changeActiveCard,
  changeProcessInitData,
  changeValueCard,
  setDataItemStep,
} from "../Ui.slice";
import { AddItemCommand } from "../../../../models/command/AddItemCommand";
import { ChangeCountItemCommand } from "../../../../models/command/ChangeCountItemCommand";
import { ChangeColorItemCommand } from "../../../../models/command/ChangeColorItemCommand";
import { getPermissionNameByItemName } from '../../../../utils/permissionUtils'
import { RemoveItemCommand } from '../../../../models/command/RemoveItemCommand'

declare const app: Application;

export const getUiHandlers = (store: Store) => {
  app.eventEmitter.on("processInitThreekitData", (data: boolean) => {
    store.dispatch(changeProcessInitData(data));
  });

  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand) {
      const asset = data.asset as AssetI;
      const activeStep = store.getState().ui.activeStep;
      if (activeStep) {
        const index = activeStep.cards.findIndex(
          (item: ItemCardI) => item.threekit?.assetId === asset.id
        );
        if (index !== -1) {
          store.dispatch(changeActiveCard(activeStep.cards[index]));
        }
      }
      console.log(data.asset);
    }

    if(data instanceof RemoveItemCommand) {
      store.dispatch(changeActiveCard(undefined));
    }

    if (data instanceof ChangeCountItemCommand) {
      const activeStep = store.getState().ui.activeStep;
      if (activeStep) {
        const index = activeStep.cards.findIndex(
          (item: ItemCardI) => item.threekit?.assetId === data.assetId
        );
        if (index !== -1) {
          const card = activeStep.cards[index];
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
    }

    if (data instanceof ChangeColorItemCommand) {
      const activeStep = store.getState().ui.activeStep;
      if (activeStep) {
        const index = activeStep.cards.findIndex(
          (item: ItemCardI) => item.threekit?.assetId === data.assetId
        );
        if (index !== -1) {
          const card = activeStep.cards[index];
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
    }
  );
};

function setAudioExtensionsData(configurator: Configurator) {
  return (store: Store) => {
    const audioExtensionsCardData: Array<ItemCardI> = [];
    Configurator.AudioExtensionName.forEach((item) => {
      const [name, qtyName] = item;
      const value = configurator.getValueByPropertyName(name);
      if (!value) {
        return;
      }

      const temp: Array<ItemCardI> = [];
      value.values.forEach((item: ConfiguratorDataValueType) => {
        const asset = item as AssetI;
        temp.push({
          key: StepName.AudioExtensions,
          image: MicImg,
          header_title: asset.name,
          title: asset.name,
          threekit: {
            assetId: asset.id,
            key: name,
          },
          keyPermission: getPermissionNameByItemName(asset.name),
          color: {
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
        const qty = configurator.getValueByPropertyName(qtyName);
        temp.forEach((item) => {
          const values = qty.values as Array<string>;
          const min = parseInt(values[0]);
          const max = parseInt(values[values.length - 1]);

          item.counter = {
            min: min,
            max: max,
            currentValue: min,
          };
        });
      }

      audioExtensionsCardData.push(...temp);
    });

    store.dispatch(
      setDataItemStep({
        key: StepName.AudioExtensions,
        values: audioExtensionsCardData,
      })
    );
  };
}

function setCameraData(configurator: Configurator) {
  return (store: Store) => {
    const cameraCardData: Array<ItemCardI> = [];
    Configurator.CameraName.forEach((item) => {
      const [name] = item;
      const value = configurator.getValueByPropertyName(name);
      if (!value) {
        return;
      }

      const temp: Array<ItemCardI> = [];
      value.values.forEach((item: ConfiguratorDataValueType) => {
        const asset = item as AssetI;
        temp.push({
          key: StepName.ConferenceCamera,
          image: CameraImg,
          header_title: asset.name,
          title: asset.name,
          threekit: {
            assetId: asset.id,
            key: name,
          },
          keyPermission: getPermissionNameByItemName(asset.name),
          color: {
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

      cameraCardData.push(...temp);
    });

    store.dispatch(
      setDataItemStep({
        key: StepName.ConferenceCamera,
        values: cameraCardData,
      })
    );
  };
}

function setMeetingControllerData(configurator: Configurator) {
  return (store: Store) => {
    const meetingControllerCardData: Array<ItemCardI> = [];
    Configurator.MeetingControllerName.forEach((item) => {
      const [name, qtyName] = item;
      const value = configurator.getValueByPropertyName(name);
      if (!value) {
        return;
      }

      const temp: Array<ItemCardI> = [];
      value.values.forEach((item: ConfiguratorDataValueType) => {
        const asset = item as AssetI;
        temp.push({
          key: StepName.MeetingController,
          image: ControllerImg,
          header_title: asset.name,
          title: asset.name,
          subtitle: "Minimum (1)",
          threekit: {
            assetId: asset.id,
            key: name,
          },
          keyPermission: getPermissionNameByItemName(asset.name),
        });
      });

      if (qtyName) {
        const qty = configurator.getValueByPropertyName(qtyName);
        temp.forEach((item) => {
          const values = qty.values as Array<string>;
          const min = parseInt(values[0]);
          const max = parseInt(values[values.length - 1]);

          item.counter = {
            min: min,
            max: max,
            currentValue: min,
          };
        });
      }

      meetingControllerCardData.push(...temp);
    });

    store.dispatch(
      setDataItemStep({
        key: StepName.MeetingController,
        values: meetingControllerCardData,
      })
    );
  };
}

function setVideoAccessoriesData(configurator: Configurator) {
  return (store: Store) => {
    const videoAccessoriesCardData: Array<ItemCardI> = [];
    Configurator.VideoAccessoriesName.forEach((item) => {
      const [name, qtyName] = item;
      const value = configurator.getValueByPropertyName(name);
      if (!value) {
        return;
      }

      const temp: Array<ItemCardI> = [];
      value.values.forEach((item: ConfiguratorDataValueType) => {
        const asset = item as AssetI;
        temp.push({
          key: StepName.VideoAccessories,
          image: AccessImg,
          header_title: asset.name,
          title: asset.name,
          threekit: {
            assetId: asset.id,
            key: name,
          },
          keyPermission: getPermissionNameByItemName(asset.name),
        });
      });

      if (qtyName) {
        const qty = configurator.getValueByPropertyName(qtyName);
        temp.forEach((item) => {
          const values = qty.values as Array<string>;
          const min = parseInt(values[0]);
          const max = parseInt(values[values.length - 1]);
          item.counter = {
            min: min,
            max: max,
            currentValue: min,
          };
        });
      }

      videoAccessoriesCardData.push(...temp);
    });

    store.dispatch(
      setDataItemStep({
        key: StepName.VideoAccessories,
        values: videoAccessoriesCardData,
      })
    );
  };
}

function setSoftwareServicesData(configurator: Configurator) {
  return (store: Store) => {
    const softwareServicesCardData: Array<ItemCardI> = [];
    Configurator.SoftwareServicesName.forEach((item) => {
      const [name] = item;
      const value = configurator.getValueByPropertyName(name);
      if (!value) {
        return;
      }

      const temp: Array<ItemCardI> = [];

      if (name.includes("Support")) {
        const title = "Logitech Select";

        const values: Array<string> = [];
        value.values.forEach((item: ConfiguratorDataValueType) => {
          const asset = item as AssetI;
          const plan = asset.metadata["Service Plan"];
          if (plan) {
            values.push(plan);
          }
        });

        temp.push({
          key: StepName.SoftwareServices,
          image: ServiceImg,
          header_title: title,
          title: title,
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
          keyPermission: getPermissionNameByItemName("Support Service"),
        });
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
