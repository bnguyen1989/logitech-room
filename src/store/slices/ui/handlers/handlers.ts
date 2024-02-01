import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { Configurator } from "../../../../models/configurator/Configurator";
import { AssetI } from "../../../../services/Threekit/type";
import { ConfiguratorDataValueType } from "../../../../models/configurator/type";
import { ItemCardI, StepName } from "../type";
import MicImg from "../../../../assets/images/items/mic.jpg";
import { changeActiveCard, setDataItemStep } from "../Ui.slice";
import { AddItemCommand } from "../../../../models/command/AddItemCommand";

declare const app: Application;

export const getUiHandlers = (store: Store) => {
  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand) {
      const asset = data.asset as AssetI;
      const activeStep = store.getState().ui.activeStep;
      if(activeStep) {
        const index = activeStep.cards.findIndex((item: ItemCardI) => item.assetId === asset.id);
        if(index !== -1) {
          store.dispatch(changeActiveCard(activeStep.cards[index]));
        }
      }
      console.log(data.asset);
    }
  });

  app.eventEmitter.on(
    "threekitDataInitialized",
    (configurator: Configurator) => {
      setAudioExtensionsData(configurator)(store);
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
          assetId: asset.id,
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
