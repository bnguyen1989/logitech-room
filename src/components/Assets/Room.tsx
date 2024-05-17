import { useScene } from "@threekit/react-three-fiber";
import * as THREE from "three";

import { GLTFNode } from "./GLTFNode.js";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeStatusBuilding } from "../../store/slices/configurator/Configurator.slice.js";
import { ProductsNodes } from "./ProductsNodes.js";
import { useThree } from "@react-three/fiber";

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
  const gltf = useScene({ assetId: roomAssetId });
  const threeSet = useThree(({ set }) => set);
  const threeScene = useThree(({ scene }) => scene);

  useEffect(() => {
    if (!gltf) return;
    dispatch(changeStatusBuilding(false));
    const camera = gltf.scene.userData.camera as THREE.PerspectiveCamera;
    camera.near = 0.1;
    camera.far = 1000;
    threeScene.environment = gltf.scene.userData.domeLight.image;
    threeSet({ camera });
  }, [gltf]);

  if (!gltf) return <></>;
  const { camera } = gltf.scene.userData;

  return (
    <>
      {camera && <primitive object={camera}></primitive>}
      <GLTFNode threeNode={gltf.scene} nodeMatchers={ProductsNodes()} />
    </>
  );
};
