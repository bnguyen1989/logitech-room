import { RootState } from "../../..";
import { Application } from "../../../../models/Application";
import { Dimension } from "../../../../models/dimension/Dimension";
import { DimensionNodeData } from "../../../../models/dimension/type";
import { DimensionService } from "../../../../services/DimensionService/DimensionService";
import { getPermission } from "../../ui/selectors/selectors";

declare const app: Application;

export const getDimension = (state: RootState): Dimension => {
  const permission = getPermission()(state);
  const dataCondition = new DimensionService().getDimensionDataByTable(
    app.dimensionDataTable
  );
  const dimension = new Dimension(permission, dataCondition);

  return dimension;
};

export const getDimensionNodeData = (state: RootState): DimensionNodeData[] => {
  const dimension = getDimension(state);
  return dimension.getDataDimension();
};
