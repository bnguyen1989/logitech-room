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
import { RALLYBOARD_FLOOR_ASSET_ID } from "../../constants/rallyBoard.js";

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
      // Check if RallyBoard_Mount node already exists
      let rallyBarMountNode: THREE.Object3D | null = null;
      gltf.scene.traverse((node) => {
        if (node.name === "RallyBoard_Mount") {
          rallyBarMountNode = node;
        }
      });

      if (!rallyBarMountNode) {
        // Find TV display mesh to calculate center
        let tvDisplayMesh: THREE.Mesh | null = null;
        gltf.scene.traverse((node) => {
          if (node instanceof THREE.Mesh && node.name.includes("tv")) {
            tvDisplayMesh = node;
          }
        });

        if (tvDisplayMesh) {
          // Calculate bounding box of TV display
          const box = new THREE.Box3();
          box.setFromObject(tvDisplayMesh);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3()); // {x: width, y: height, z: depth}
          const min = box.min.clone(); // Minimum corner (back face if TV on wall)
          const max = box.max.clone(); // Maximum corner (front face if TV on wall)

          // Get world rotation from TV display mesh
          const worldQuaternion = new THREE.Quaternion();
          const tvMesh = tvDisplayMesh as THREE.Mesh;
          tvMesh.getWorldQuaternion(worldQuaternion);

          // ⭐ QUAN TRỌNG: Tính toán front face position thay vì center
          // TV nằm trên tường, front face hướng về room
          // User confirmed: Front face của TV hướng về +Z trong world space
          // Để placement node nằm trên tường thay vì trong tường,
          // chúng ta sử dụng max.z từ bounding box (front face position)

          // Bounding box được tính trong world space (đã account cho rotation)
          // Nếu front face hướng về +Z trong world space:
          // - max.z là front face (hướng về +Z, ra ngoài tường)
          // - min.z là back face (hướng về -Z, vào trong tường)
          // - center.z là giữa (nằm trong tường)

          // Placement node position = front face position (max.z)
          // Giữ nguyên X và Y từ center, chỉ thay đổi Z = max.z
          const frontFacePosition = new THREE.Vector3(
            center.x, // Giữ nguyên X
            center.y, // Giữ nguyên Y
            max.z // Front face Z position (hướng về +Z, ra ngoài tường)
          );

          // ⭐ THÊM OFFSET: Di chuyển placement node ra ngoài tường thêm một khoảng
          // Offset này giúp RallyBoard không chỉ nằm trên tường mà còn lùi ra ngoài tường
          // Offset: 5 cm = 0.05 meters (có thể điều chỉnh)
          const wallOffset = 0.18; // 5 cm trong meters

          // Front face direction trong world space là +Z
          const frontFaceDirection = new THREE.Vector3(0, 0, 1); // +Z trong world space

          // Tính offset vector (di chuyển theo hướng +Z)
          const offsetVector = frontFaceDirection
            .clone()
            .multiplyScalar(wallOffset);

          // Cộng offset vào front face position
          const finalPosition = frontFacePosition.clone().add(offsetVector);

          console.log("📺 [Room] Creating RallyBoard_Mount placement node:", {
            tvCenter: {
              x: center.x.toFixed(4),
              y: center.y.toFixed(4),
              z: center.z.toFixed(4),
              note: "TV center (nằm trong tường)",
            },
            tvMin: {
              x: min.x.toFixed(4),
              y: min.y.toFixed(4),
              z: min.z.toFixed(4),
              note: "TV back face (vào trong tường, hướng -Z)",
            },
            tvMax: {
              x: max.x.toFixed(4),
              y: max.y.toFixed(4),
              z: max.z.toFixed(4),
              note: "TV front face (ra ngoài tường, hướng +Z)",
            },
            tvSize: {
              x: size.x.toFixed(4),
              y: size.y.toFixed(4),
              z: size.z.toFixed(4),
              note: "TV size (width, height, depth)",
            },
            frontFacePosition: {
              x: frontFacePosition.x.toFixed(4),
              y: frontFacePosition.y.toFixed(4),
              z: frontFacePosition.z.toFixed(4),
              note: "TV front face position (max.z, trên tường)",
            },
            wallOffset: {
              distance: wallOffset.toFixed(4),
              unit: "meters (5 cm)",
              direction: "+Z (ra ngoài tường)",
              offsetVector: {
                x: offsetVector.x.toFixed(4),
                y: offsetVector.y.toFixed(4),
                z: offsetVector.z.toFixed(4),
              },
              note: "Offset để đưa RallyBoard ra ngoài tường thêm",
            },
            finalPosition: {
              x: finalPosition.x.toFixed(4),
              y: finalPosition.y.toFixed(4),
              z: finalPosition.z.toFixed(4),
              note: "Placement node tại front face + offset (ra ngoài tường)",
            },
            offsetFromCenter: {
              x: (finalPosition.x - center.x).toFixed(4),
              y: (finalPosition.y - center.y).toFixed(4),
              z: (finalPosition.z - center.z).toFixed(4),
              note: "Offset từ center (trong tường) đến final position (ra ngoài tường)",
            },
            offsetFromFrontFace: {
              x: (finalPosition.x - frontFacePosition.x).toFixed(4),
              y: (finalPosition.y - frontFacePosition.y).toFixed(4),
              z: (finalPosition.z - frontFacePosition.z).toFixed(4),
              note: "Offset từ front face đến final position",
            },
            depth: {
              value: size.z.toFixed(4),
              note: "Độ sâu của TV (depth)",
            },
            note: "Placement node tại front face + offset (ra ngoài tường) thay vì center (trong tường)",
          });

          // Create new placement node at TV front face position + offset
          const placementNode = new THREE.Object3D();
          placementNode.name = "RallyBoard_Mount";
          placementNode.position.copy(finalPosition); // ⭐ Position tại front face + offset (ra ngoài tường)

          // ⭐ QUAN TRỌNG: Xoay placement node 180 độ theo trục Y để RallyBoard mặt trước hướng ra ngoài
          // TV front face hướng về +Z trong world space
          // RallyBoard được orient trong Product.tsx để front face hướng về -Z (room front)
          // Nhưng vì TV front face hướng về +Z, nên RallyBoard bị úp mặt vào tường
          // Giải pháp: Xoay placement node 180 độ theo trục Y để RallyBoard quay mặt ra ngoài

          // Tạo quaternion cho rotation 180 độ theo trục Y
          // Rotation này sẽ được apply trong local space của placement node
          const rotation180Y = new THREE.Quaternion();
          rotation180Y.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI); // 180 độ = π radians

          // Kết hợp TV quaternion với rotation 180 độ Y
          // Thứ tự: worldQuaternion * rotation180Y
          // Điều này sẽ apply TV rotation trước, sau đó xoay thêm 180 độ Y
          const finalQuaternion = new THREE.Quaternion();
          finalQuaternion.multiplyQuaternions(worldQuaternion, rotation180Y);

          placementNode.quaternion.copy(finalQuaternion);
          placementNode.scale.set(1, 1, 1); // Scale = 1,1,1 for placement node

          // Debug log
          const tvEuler = new THREE.Euler();
          tvEuler.setFromQuaternion(worldQuaternion);
          const finalEuler = new THREE.Euler();
          finalEuler.setFromQuaternion(finalQuaternion);

          console.log("🔄 [Room] Placement node rotation (180° Y rotation):", {
            tvQuaternion: {
              x: worldQuaternion.x.toFixed(4),
              y: worldQuaternion.y.toFixed(4),
              z: worldQuaternion.z.toFixed(4),
              w: worldQuaternion.w.toFixed(4),
            },
            tvEuler: {
              x: tvEuler.x.toFixed(4),
              y: tvEuler.y.toFixed(4),
              z: tvEuler.z.toFixed(4),
              xDegrees: ((tvEuler.x * 180) / Math.PI).toFixed(2) + "°",
              yDegrees: ((tvEuler.y * 180) / Math.PI).toFixed(2) + "°",
              zDegrees: ((tvEuler.z * 180) / Math.PI).toFixed(2) + "°",
            },
            rotation180Y: {
              x: rotation180Y.x.toFixed(4),
              y: rotation180Y.y.toFixed(4),
              z: rotation180Y.z.toFixed(4),
              w: rotation180Y.w.toFixed(4),
              note: "180° rotation around Y axis",
            },
            finalEuler: {
              x: finalEuler.x.toFixed(4),
              y: finalEuler.y.toFixed(4),
              z: finalEuler.z.toFixed(4),
              xDegrees: ((finalEuler.x * 180) / Math.PI).toFixed(2) + "°",
              yDegrees: ((finalEuler.y * 180) / Math.PI).toFixed(2) + "°",
              zDegrees: ((finalEuler.z * 180) / Math.PI).toFixed(2) + "°",
            },
            yRotationDelta: {
              radians: (finalEuler.y - tvEuler.y).toFixed(4),
              degrees:
                (((finalEuler.y - tvEuler.y) * 180) / Math.PI).toFixed(2) + "°",
              note: "Y rotation delta (should be ~180°)",
            },
            finalQuaternion: {
              x: finalQuaternion.x.toFixed(4),
              y: finalQuaternion.y.toFixed(4),
              z: finalQuaternion.z.toFixed(4),
              w: finalQuaternion.w.toFixed(4),
            },
            note: "Placement node rotated 180° Y to face RallyBoard front outwards (away from wall)",
          });

          // Add to scene
          gltf.scene.add(placementNode);
        }
      }

      // ============================================
      // ROTATE EXISTING CREDENZA PLACEMENT NODES (Camera_Commode_*)
      // ============================================
      const credenzaNodeNames = [
        PlacementManager.getNameNodeCommodeForCamera("Huddle"),
      ];
      const credenzaRotationQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI
      );
      const credenzaHeightOffset = 0.42; // 20 cm lift above current surface
      const CREDENZA_ROTATED_FLAG = "_rallyboardCredenzaRotated";

      gltf.scene.traverse((node) => {
        if (!node?.name) return;
        if (!credenzaNodeNames.includes(node.name)) return;
        if (node.userData?.[CREDENZA_ROTATED_FLAG]) {
          return;
        }

        const originalQuaternion = node.quaternion.clone();
        const originalPosition = node.position.clone();

        node.quaternion.multiply(credenzaRotationQuat);
        node.position.add(new THREE.Vector3(0, 0, credenzaHeightOffset));
        node.userData[CREDENZA_ROTATED_FLAG] = true;

        const originalEuler = new THREE.Euler().setFromQuaternion(
          originalQuaternion
        );
        const updatedEuler = new THREE.Euler().setFromQuaternion(
          node.quaternion
        );

        console.log("🔁 [Room] Adjusted credenza placement node:", {
          nodeName: node.name,
          heightOffsetMeters: credenzaHeightOffset.toFixed(3),
          originalPosition: {
            x: originalPosition.x.toFixed(4),
            y: originalPosition.y.toFixed(4),
            z: originalPosition.z.toFixed(4),
          },
          updatedPosition: {
            x: node.position.x.toFixed(4),
            y: node.position.y.toFixed(4),
            z: node.position.z.toFixed(4),
          },
          originalQuaternion: {
            x: originalQuaternion.x.toFixed(4),
            y: originalQuaternion.y.toFixed(4),
            z: originalQuaternion.z.toFixed(4),
            w: originalQuaternion.w.toFixed(4),
          },
          updatedQuaternion: {
            x: node.quaternion.x.toFixed(4),
            y: node.quaternion.y.toFixed(4),
            z: node.quaternion.z.toFixed(4),
            w: node.quaternion.w.toFixed(4),
          },
          originalEuler: {
            xDegrees: ((originalEuler.x * 180) / Math.PI).toFixed(2),
            yDegrees: ((originalEuler.y * 180) / Math.PI).toFixed(2),
            zDegrees: ((originalEuler.z * 180) / Math.PI).toFixed(2),
          },
          updatedEuler: {
            xDegrees: ((updatedEuler.x * 180) / Math.PI).toFixed(2),
            yDegrees: ((updatedEuler.y * 180) / Math.PI).toFixed(2),
            zDegrees: ((updatedEuler.z * 180) / Math.PI).toFixed(2),
          },
        });
      });

      // ============================================
      // END CREATE/ADJUST PLACEMENT NODES
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

  // Check if any RallyBoard placement (wall or credenza) is selected
  const rallyBoardCredenzaNode =
    PlacementManager.getNameNodeCommodeForCamera("Huddle");
  const rallyBoardPlacementNames = [
    PlacementManager.getNameNodeForRallyBoardMount(),
    rallyBoardCredenzaNode,
  ];
  const isRallyBoardSelected = rallyBoardPlacementNames.some(
    (name) => nodes[name] !== undefined
  );
  const isRallyBoardFloorSelected =
    nodes[rallyBoardCredenzaNode] === RALLYBOARD_FLOOR_ASSET_ID;

  return (
    <>
      {three.camera && <primitive object={three.camera}></primitive>}
      <ambientLight intensity={1.5} color={"#ffffff"} />
      <GLTFNode
        threeNode={gltf.scene}
        nodeMatchers={ProductsNodes({
          isRallyBoardSelected,
          isRallyBoardFloorSelected,
        })}
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
