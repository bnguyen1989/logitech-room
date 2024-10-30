import { RootState } from "../../..";
import { Application } from "../../../../models/Application";
import { Dimension } from "../../../../models/dimension/Dimension";
import { DimensionNodeData } from "../../../../models/dimension/type";
import { getPermission } from "../../ui/selectors/selectors";

declare const app: Application;

export const getDimension = (state: RootState): Dimension => {
  const permission = getPermission()(state);
  const dimension = new Dimension(permission, app.dimensionDataTable);

  return dimension;
};

export const getDimensionNodeData = (state: RootState): DimensionNodeData[] => {
  const dimension = getDimension(state);
  return dimension.getDataDimension();
};
