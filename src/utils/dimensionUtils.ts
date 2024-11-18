import { Mesh, Vector3 } from "three";
import type { ArrVector3T } from "../types/mathType";

export const getWorldPositionByNode = (node: Mesh) => {
  const worldPosition = new Vector3();
  node.getWorldPosition(worldPosition);
  return worldPosition.toArray() as ArrVector3T;
};
