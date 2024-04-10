import { RootState } from "../../..";
import { getSeparatorItemColor } from "../../../../utils/baseUtils";
import { StepName } from "../type";
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
  (keyItemPermission: string) => (state: RootState) => {
    const assetCard = getAllAssetFromCard(keyItemPermission)(state);

    const colorsData = getColorsData();

    function getColors(items: string[]) {
      const colors: string[] = [];

      const separatorItemColor = getSeparatorItemColor();

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
      availableColors.includes(color.name)
    );

    return availableColorsData;
  };
