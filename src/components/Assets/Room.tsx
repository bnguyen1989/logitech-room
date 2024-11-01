import { useScene } from "@threekit/react-three-fiber";
import * as THREE from "three";

import { GLTFNode } from "./GLTFNode.js";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeStatusBuilding } from "../../store/slices/configurator/Configurator.slice.js";
import { ProductsNodes } from "./ProductsNodes.js";
import { useThree } from "@react-three/fiber";
import { CameraRoom } from "./CameraRoom.js";
import { Dimension } from '../Dimension/Dimension.js'

export type RoomProps = {
  roomAssetId: string;
  attachNodeNameToAssetId?: Record<string, string>;
  setSnapshotCameras: (cameras: Record<string, THREE.Camera>) => void;
};

export const logNode = (node: THREE.Object3D, depth = 0) => {
  const prefix = " ".repeat(depth);
  console.log(`${prefix}${node.name}[${node.constructor.name}]`);
  node.children.forEach((child) => logNode(child, depth + 1));
};

export const Room: React.FC<RoomProps> = (props) => {
  const { roomAssetId, setSnapshotCameras } = props;
  const dispatch = useDispatch();
  const gltf = useScene({ assetId: roomAssetId });
  const three = useThree();

  useEffect(() => {
    if (!gltf) return;

    dispatch(changeStatusBuilding(false));

    const { "1": Front, "2": Left } = gltf.cameras;

    if (Front && Left) {
      setSnapshotCameras({
        Front: new THREE.PerspectiveCamera().copy(
          Front as THREE.PerspectiveCamera
        ),
        Left: new THREE.PerspectiveCamera().copy(
          Left as THREE.PerspectiveCamera
        ),
      });
    }

    const domeLight = gltf.scene.userData.domeLight;
    const camera = gltf.scene.userData.camera as THREE.PerspectiveCamera;
    three.scene.environment = domeLight.image;
    camera.aspect = three.size.width / three.size.height;
    camera.updateProjectionMatrix();
    three.set({ camera });

    gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh && node.isMesh) {
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];

        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.envMapIntensity = domeLight.intensity;
          }
        });
      }
    });
  }, [gltf]);

  if (!gltf) return <></>;
  const { camera } = gltf.scene.userData;

  return (
    <>
      {camera && <primitive object={camera}></primitive>}
      <ambientLight intensity={1.5} color={"#ffffff"} />
      <GLTFNode threeNode={gltf.scene} nodeMatchers={ProductsNodes()} />
      <Dimension threeNode={gltf.scene} />
      <CameraRoom gltf={gltf} camera={camera} roomAssetId={roomAssetId} />
    </>
  );
};
