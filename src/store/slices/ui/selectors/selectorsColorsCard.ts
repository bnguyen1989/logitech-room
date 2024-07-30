import { RootState } from "../../..";
import { StepName, getSeparatorItem } from "../../../../utils/baseUtils";
import { getColorsData } from "../utils";
import {
  getAllAssetFromCard,
  getSelectedDataByKeyPermission,
} from "./selectors";

export const getPropertyColorCardByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const data = getSelectedDataByKeyPermission(stepName, keyPermission)(state);
    const value = data?.property?.color;
    return value ? value : "";
  };

export const getColorsFromCard =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {

    const assetCard = getAllAssetFromCard(stepName, keyPermission)(state);

    const colorsData = getColorsData();

    function getColors(items: string[]) {
      const colors: string[] = [];

      const separatorItemColor = getSeparatorItem();

      items.forEach((item) => {
        const parts = item.split(separatorItemColor);
        if (parts.length === 2) {
          const color = parts[1];
          if (!colors.includes(color)) {
            colors.push(color);
          }
        }
      });

      return colors;
    }

    const availableColors = getColors(Object.keys(assetCard));

    const availableColorsData = colorsData.filter((color) =>
      availableColors.some((ac) => ac.includes(color.name))
    );

    return availableColorsData;
  };
