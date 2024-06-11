import { cloneDeep } from "lodash";

export const deepCopy = (obj: any) => {
  return cloneDeep(obj);
};
