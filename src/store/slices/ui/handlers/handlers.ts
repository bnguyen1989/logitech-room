import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { Configurator } from "../../../../models/configurator/Configurator";
import { AssetI } from "../../../../services/Threekit/type";
import { ConfiguratorDataValueType } from "../../../../models/configurator/type";
import { ColorItemI, ItemCardI, StepName } from "../type";
import MicImg from "../../../../assets/images/items/mic.jpg";
import CameraImg from "../../../../assets/images/items/camera.jpg";
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
      value.values.forEach((item: ConfiguratorDataValueType) => {
        const asset = item as AssetI;
        audioExtensionsCardData.push({
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
          },
          counter: {
            min: 1,
            max: 3,
            currentValue: 1,
          },
        });
      });

      if (qtyName) {
        const qty = configurator.getValueByPropertyName(qtyName);
        audioExtensionsCardData.forEach((item) => {
          const values = qty.values as Array<string>;
          const min = parseInt(values[1]);
          const max = parseInt(values[values.length - 1]);
          if (item.counter) {
            item.counter.min = min;
            item.counter.max = max;
            item.counter.currentValue = min;
          }
        });
      }
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
      value.values.forEach((item: ConfiguratorDataValueType) => {
        const asset = item as AssetI;
        cameraCardData.push({
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
        },);
      });
    });

    store.dispatch(
      setDataItemStep({
        key: StepName.ConferenceCamera,
        values: cameraCardData,
      })
    );
  };
}
