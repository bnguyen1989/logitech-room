import { createAction } from "@reduxjs/toolkit";
import { CUSTOM_UI_ACTION_NAME } from "../utils";
import { Configurator } from "../../../../models/configurator/Configurator";

export const changeDisplayItem = createAction<{
  key: string;
  value: string;
}>(CUSTOM_UI_ACTION_NAME.CHANGE_DISPLAY_ITEM);

export const changeCountItem = createAction<{
  key: string;
  value: number;
}>(CUSTOM_UI_ACTION_NAME.CHANGE_COUNT_ITEM);

export const changeColorItem = createAction<{
  key: string;
  value: string;
}>(CUSTOM_UI_ACTION_NAME.CHANGE_COLOR_ITEM);

export const createOrder = createAction<{
  configurator: Configurator;
}>(CUSTOM_UI_ACTION_NAME.CREATE_ORDER);
