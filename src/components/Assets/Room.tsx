import { useAsset } from "@threekit/react-three-fiber";

import { GLTFNode } from "./GLTFNode.js";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeStatusBuilding } from "../../store/slices/configurator/Configurator.slice.js";
import { ProductsNodes } from "./ProductsNodes.js";

export type RoomProps = {
  roomAssetId: string;
  attachNodeNameToAssetId?: Record<string, string>;
};

export const logNode = (node: THREE.Object3D, depth = 0) => {
  const prefix = " ".repeat(depth);
  console.log(`${prefix}${node.name}[${node.constructor.name}]`);
  node.children.forEach((child) => logNode(child, depth + 1));
};

export const Room: React.FC<RoomProps> = ({ roomAssetId }) => {
  const dispatch = useDispatch();
  const gltf = useAsset({ assetId: roomAssetId });

  useEffect(() => {
    if (!gltf) return;
    dispatch(changeStatusBuilding(false));
  }, [gltf]);
console.log('Room');

  return <GLTFNode threeNode={gltf.scene} nodeMatchers={ProductsNodes()} />;
};
