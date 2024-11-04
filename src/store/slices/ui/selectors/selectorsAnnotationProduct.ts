import { RootState } from "../../..";
import { StepName } from "../../../../utils/baseUtils";
import {
  getCardByKeyPermission,
  getMetadataProductNameAssetFromCard,
  getTitleCardByKeyPermission,
} from "./selectors";

export const getAnnotationDataByKeyPermissions =
  (stepName: StepName, keyPermissions: string[]) => (state: RootState) => {
    return keyPermissions.map((keyPermission) => {
      const title = getTitleCardByKeyPermission(stepName, keyPermission)(state);
      const card = getCardByKeyPermission(stepName, keyPermission)(state);
      const productName = getMetadataProductNameAssetFromCard(card)(state);

      return {
        title,
        card,
        productName,
      };
    });
  };
