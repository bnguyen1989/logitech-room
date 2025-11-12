import { useScene } from "@threekit/react-three-fiber";
import * as THREE from "three";

import { GLTFNode } from "./GLTFNode.js";

import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/redux.js";
import { changeStatusBuilding } from "../../store/slices/configurator/Configurator.slice.js";
import { getNodes } from "../../store/slices/configurator/selectors/selectors.js";
import { PlacementManager } from "../../models/configurator/PlacementManager.js";
import { ProductsNodes } from "./ProductsNodes.js";
import { useThree } from "@react-three/fiber";
import { CameraRoom } from "./CameraRoom.js";
import { Dimension } from "../Dimension/Dimension.js";
import { PlacementNodesVisualizer } from "./PlacementNodesVisualizer.js";

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

/**
 * Creates a RallyBoard_Mount placement node at the TV center position
 * @param scene - The THREE.Object3D (scene or group) to add the placement node to
 * @returns The created placement node, or null if it already exists or TV mesh not found
 */
const addRallyBoard = (scene: THREE.Object3D): THREE.Object3D | null => {
  const placementNodeName = PlacementManager.getNameNodeForRallyBoardMount();

  // Check if RallyBoard_Mount node already exists
  let existingNode: THREE.Object3D | null = null;
  scene.traverse((node) => {
    if (node.name === placementNodeName) {
      existingNode = node;
    }
  });

  if (existingNode) {
    console.log(
      `ℹ️ [addRallyBoard] Placement node ${placementNodeName} already exists`
    );
    return existingNode;
  }

  // Find TV display mesh to calculate center
  let tvDisplayMesh: THREE.Mesh | null = null;
  scene.traverse((node) => {
    if (node instanceof THREE.Mesh && node.name.toLowerCase().includes("tv")) {
      // Prefer tv_display_phonebooth if available, otherwise use first TV mesh
      if (!tvDisplayMesh || node.name.toLowerCase().includes("display")) {
        tvDisplayMesh = node;
      }
    }
  });

  if (!tvDisplayMesh) {
    console.warn(
      `⚠️ [addRallyBoard] TV display mesh not found. Cannot create ${placementNodeName} placement node.`
    );
    return null;
  }

  // Calculate bounding box of TV display to get center
  const box = new THREE.Box3();
  box.setFromObject(tvDisplayMesh);
  const center = box.getCenter(new THREE.Vector3());

  // Get world rotation from TV display mesh
  const worldQuaternion = new THREE.Quaternion();
  (tvDisplayMesh as THREE.Mesh).getWorldQuaternion(worldQuaternion);

  // Create new placement node at TV center
  const placementNode = new THREE.Object3D();
  placementNode.name = placementNodeName;
  placementNode.position.copy(center);
  placementNode.quaternion.copy(worldQuaternion);
  placementNode.scale.set(1, 1, 1);

  // Add to scene
  scene.add(placementNode);

  console.log(
    `✅ [addRallyBoard] Created placement node ${placementNodeName} at TV center:`,
    {
      position: { x: center.x, y: center.y, z: center.z },
      rotation: {
        x: placementNode.rotation.x,
        y: placementNode.rotation.y,
        z: placementNode.rotation.z,
      },
      boundingBox: {
        min: { x: box.min.x, y: box.min.y, z: box.min.z },
        max: { x: box.max.x, y: box.max.y, z: box.max.z },
      },
      tvMeshName: (tvDisplayMesh as THREE.Mesh).name,
    }
  );

  return placementNode;
};

export const Room: React.FC<RoomProps> = (props) => {
  const { roomAssetId, setSnapshotCameras } = props;

  // Debug logs
  console.log("🔍 Room component render:", { roomAssetId });

  const dispatch = useDispatch();
  const gltf = useScene({ assetId: roomAssetId });
  const three = useThree();

  // Get nodes mapping from Redux to check if RallyBoard is selected
  const nodes = useAppSelector(getNodes);

  const setMainCamera = useCallback(
    (camera: THREE.PerspectiveCamera) => {
      if (!three?.size || !three?.set) {
        console.warn("⚠️ three object not ready");
        return;
      }
      camera.aspect = three.size.width / three.size.height;
      camera.updateProjectionMatrix();
      three.set({ camera });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [three.size.width, three.size.height]
  );

  useEffect(() => {
    console.log("🔄 Room useEffect triggered:", { hasGltf: !!gltf });

    if (!gltf) {
      console.log("⏳ Waiting for GLTF to load...");
      return;
    }

    try {
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

      if (domeLight?.image) {
        three.scene.environment = domeLight.image;
      }

      if (camera) {
        setMainCamera(camera);
      }

      // ============================================
      // CREATE PLACEMENT NODE RallyBoard_Mount AT TV CENTER POSITION
      // ============================================
      addRallyBoard(gltf.scene);
      // ============================================
      // END CREATE PLACEMENT NODE
      // ============================================

      // ============================================
      // HIDE TV WHEN RALLYBOARD IS SELECTED
      // ============================================
      // This will be handled in a separate useEffect that watches Redux store
      // ============================================

      gltf.scene.traverse((node) => {
        if (node instanceof THREE.Mesh && node.isMesh) {
          const materials = Array.isArray(node.material)
            ? node.material
            : [node.material];

          materials.forEach((material) => {
            if (
              material instanceof THREE.MeshStandardMaterial &&
              domeLight?.intensity
            ) {
              material.envMapIntensity = domeLight.intensity;
            }
          });
        }
      });
    } catch (error) {
      console.error("Error setting up room scene:", error);
    }
  }, [gltf, dispatch, setSnapshotCameras, three.scene, setMainCamera]);

  // ============================================
  // FIND TV NODES/MESHES (ONCE WHEN SCENE LOADS)
  // ============================================

  // Check if RallyBoard is selected for TV visibility control
  const rallyBoardMountNodeName =
    PlacementManager.getNameNodeForRallyBoardMount();
  const isRallyBoardSelected = nodes[rallyBoardMountNodeName] !== undefined;

  return (
    <>
      {three.camera && <primitive object={three.camera}></primitive>}
      <ambientLight intensity={1.5} color={"#ffffff"} />
      <GLTFNode
        threeNode={gltf.scene}
        nodeMatchers={ProductsNodes({ isRallyBoardSelected })}
      />
      <Dimension threeNode={gltf.scene} />
      <CameraRoom gltf={gltf} camera={three.camera} roomAssetId={roomAssetId} />

      {/* Visualize placement nodes - display in development */}
      {/* Temporarily disabled */}
      {false && process.env.NODE_ENV === "development" && gltf?.scene && (
        <PlacementNodesVisualizer
          scene={gltf.scene}
          enabled={true}
          showLabels={true}
          markerSize={0.1}
          markerColor="#ff0000"
        />
      )}
    </>
  );
};
