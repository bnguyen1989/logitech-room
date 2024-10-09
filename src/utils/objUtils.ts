import { cloneDeep } from "lodash";

export const deepCopy = <T = any>(obj: any): T => {
  return cloneDeep(obj) as T;
};
