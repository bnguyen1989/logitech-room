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
import {
  changeActiveCard,
  changeValueCard,
  setDataItemStep,
} from "../Ui.slice";
import { AddItemCommand } from "../../../../models/command/AddItemCommand";
import { ChangeCountItemCommand } from "../../../../models/command/ChangeCountItemCommand";
import { ChangeColorItemCommand } from "../../../../models/command/ChangeColorItemCommand";

declare const app: Application;

export const getUiHandlers = (store: Store) => {
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
          }
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
