import { useScene } from "@threekit/react-three-fiber";
import * as THREE from "three";

import { GLTFNode } from "./GLTFNode.js";

import { useEffect, useCallback, useState } from "react";
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

export const Room: React.FC<RoomProps> = (props) => {
  const { roomAssetId, setSnapshotCameras } = props;

  // Debug logs
  console.log("🔍 Room component render:", { roomAssetId });

  const dispatch = useDispatch();
  const gltf = useScene({ assetId: roomAssetId });
  const three = useThree();
  const [placementNodesUpdateKey, setPlacementNodesUpdateKey] = useState(0);

  // Get nodes mapping from Redux to check if RallyBoard is selected
  const nodes = useAppSelector(getNodes);

  console.log("✅ useThree() successful:", {
    hasScene: !!three?.scene,
    hasCamera: !!three?.camera,
    size: three?.size,
  });

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

    console.log("✅ GLTF loaded:", {
      hasScene: !!gltf.scene,
      hasCameras: !!gltf.cameras,
      cameras: Object.keys(gltf.cameras || {}),
    });

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
      // DEBUG CODE: LOG ALL NODES AND MESHES
      // ============================================

      console.log("==========================================");
      console.log("🔍 DEBUG: LOG ALL NODES AND MESHES");
      console.log("==========================================");

      // 1. Log all nodes (including Object3D and Mesh)
      console.log("\n📋 ALL NODES IN SCENE:");
      const allNodes: Array<{
        name: string;
        type: string;
        position: { x: number; y: number; z: number };
      }> = [];
      gltf.scene.traverse((node) => {
        if (node.name) {
          allNodes.push({
            name: node.name,
            type: node.constructor.name,
            position: {
              x: node.position.x,
              y: node.position.y,
              z: node.position.z,
            },
          });
        }
      });
      console.table(allNodes);
      console.log(`Total nodes: ${allNodes.length}`);

      // 2. Log all meshes separately
      console.log("\n🎨 ALL MESHES IN SCENE:");
      const allMeshes: Array<{
        name: string;
        position: { x: number; y: number; z: number };
        visible: boolean;
      }> = [];
      gltf.scene.traverse((node) => {
        if (node instanceof THREE.Mesh && node.isMesh) {
          allMeshes.push({
            name: node.name,
            position: {
              x: node.position.x,
              y: node.position.y,
              z: node.position.z,
            },
            visible: node.visible,
          });
        }
      });
      console.table(allMeshes);
      console.log(`Total meshes: ${allMeshes.length}`);

      // 3. Find TV mesh
      console.log("\n📺 FIND TV MESH:");
      const tvMeshes: Array<{
        name: string;
        position: { x: number; y: number; z: number };
        visible: boolean;
      }> = [];
      gltf.scene.traverse((node) => {
        if (node instanceof THREE.Mesh && node.isMesh) {
          const nameLower = node.name.toLowerCase();
          if (
            nameLower.includes("tv") ||
            nameLower.includes("display") ||
            nameLower.includes("screen") ||
            nameLower.includes("monitor")
          ) {
            tvMeshes.push({
              name: node.name,
              position: {
                x: node.position.x,
                y: node.position.y,
                z: node.position.z,
              },
              visible: node.visible,
            });
          }
        }
      });
      if (tvMeshes.length > 0) {
        console.table(tvMeshes);
        console.log(
          "✅ Found TV mesh(es):",
          tvMeshes.map((m) => m.name)
        );
      } else {
        console.log("❌ No TV mesh found");
      }

      // 4. Find Credenza mesh
      console.log("\n🪑 FIND CREDENZA MESH:");
      const credenzaMeshes: Array<{
        name: string;
        position: { x: number; y: number; z: number };
        visible: boolean;
      }> = [];
      gltf.scene.traverse((node) => {
        if (node instanceof THREE.Mesh && node.isMesh) {
          const nameLower = node.name.toLowerCase();
          if (
            nameLower.includes("credenza") ||
            nameLower.includes("cabinet") ||
            nameLower.includes("furniture") ||
            nameLower.includes("desk") ||
            nameLower.includes("table")
          ) {
            credenzaMeshes.push({
              name: node.name,
              position: {
                x: node.position.x,
                y: node.position.y,
                z: node.position.z,
              },
              visible: node.visible,
            });
          }
        }
      });
      if (credenzaMeshes.length > 0) {
        console.table(credenzaMeshes);
        console.log(
          "✅ Found Credenza mesh(es):",
          credenzaMeshes.map((m) => m.name)
        );
      } else {
        console.log("❌ No Credenza mesh found");
      }

      // 5. Find Placement Nodes
      console.log("\n📍 FIND PLACEMENT NODES:");
      const placementNodes: Array<{
        name: string;
        type: string;
        position: { x: number; y: number; z: number };
      }> = [];
      gltf.scene.traverse((node) => {
        if (node.name) {
          const nameLower = node.name.toLowerCase();
          if (nameLower.includes("placement")) {
            placementNodes.push({
              name: node.name,
              type: node.constructor.name,
              position: {
                x: node.position.x,
                y: node.position.y,
                z: node.position.z,
              },
            });
          }
        }
      });
      if (placementNodes.length > 0) {
        console.table(placementNodes);
        console.log(
          "✅ Found Placement nodes:",
          placementNodes.map((n) => n.name)
        );
      } else {
        console.log("❌ No Placement nodes found");
      }

      // 6. Find specific placement node Camera_Commode_mini_display_1
      console.log("\n🎯 FIND PLACEMENT NODE: Camera_Commode_mini_display_1");
      let targetPlacementNode: THREE.Object3D | null = null;
      gltf.scene.traverse((node) => {
        if (node.name === "Camera_Commode_mini_display_1") {
          targetPlacementNode = node;
        }
      });
      if (targetPlacementNode !== null) {
        const node = targetPlacementNode as THREE.Object3D;
        console.log("✅ Found Camera_Commode_mini_display_1:");
        console.log("  - Position:", {
          x: node.position.x,
          y: node.position.y,
          z: node.position.z,
        });
        console.log("  - Rotation:", {
          x: node.rotation.x,
          y: node.rotation.y,
          z: node.rotation.z,
        });
        console.log("  - Scale:", {
          x: node.scale.x,
          y: node.scale.y,
          z: node.scale.z,
        });
      } else {
        console.log("❌ Camera_Commode_mini_display_1 not found");
      }

      // 7. Log hierarchy (tree structure) of scene
      console.log("\n🌳 SCENE HIERARCHY:");
      logNode(gltf.scene);

      console.log("==========================================");
      console.log("✅ DEBUG LOG COMPLETED");
      console.log("==========================================");

      // ============================================
      // END DEBUG CODE
      // ============================================

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
          if (
            node instanceof THREE.Mesh &&
            node.name === "tv_display_phonebooth"
          ) {
            tvDisplayMesh = node;
          }
        });

        if (tvDisplayMesh) {
          // Calculate bounding box of TV display to get center
          const box = new THREE.Box3();
          box.setFromObject(tvDisplayMesh);
          const center = box.getCenter(new THREE.Vector3());

          // Get world rotation from TV display mesh
          const worldQuaternion = new THREE.Quaternion();
          const tvMesh = tvDisplayMesh as THREE.Mesh;
          tvMesh.getWorldQuaternion(worldQuaternion);

          // Create new placement node at TV center
          const placementNode = new THREE.Object3D();
          placementNode.name = "RallyBoard_Mount";
          placementNode.position.copy(center);
          placementNode.quaternion.copy(worldQuaternion);
          placementNode.scale.set(1, 1, 1); // Scale = 1,1,1 for placement node

          // Add to scene
          gltf.scene.add(placementNode);

          // Verify node has been added to scene
          let verifyNode: THREE.Object3D | null = null;
          gltf.scene.traverse((node) => {
            if (node.name === "RallyBoard_Mount") {
              verifyNode = node;
            }
          });

          console.log(
            "✅ Created placement node RallyBoard_Mount at TV center:",
            {
              position: {
                x: center.x,
                y: center.y,
                z: center.z,
              },
              rotation: {
                x: placementNode.rotation.x,
                y: placementNode.rotation.y,
                z: placementNode.rotation.z,
              },
              boundingBox: {
                min: { x: box.min.x, y: box.min.y, z: box.min.z },
                max: { x: box.max.x, y: box.max.y, z: box.max.z },
              },
              nodeAdded: !!verifyNode,
              nodeInScene: verifyNode ? "✅ In scene" : "❌ Not in scene",
            }
          );

          // Force re-render PlacementNodesVisualizer
          setPlacementNodesUpdateKey((prev) => prev + 1);
        } else {
          // Fallback: If TV display mesh not found, use TV parent group
          let tvNode: THREE.Object3D | null = null;
          gltf.scene.traverse((node) => {
            if (node.name === "Phonebooth_tv") {
              tvNode = node;
            }
          });

          if (tvNode) {
            const worldPosition = new THREE.Vector3();
            const worldQuaternion = new THREE.Quaternion();
            const tv = tvNode as THREE.Object3D;
            tv.getWorldPosition(worldPosition);
            tv.getWorldQuaternion(worldQuaternion);

            const placementNode = new THREE.Object3D();
            placementNode.name = "RallyBoard_Mount";
            placementNode.position.copy(worldPosition);
            placementNode.quaternion.copy(worldQuaternion);
            placementNode.scale.set(1, 1, 1);

            gltf.scene.add(placementNode);

            // Verify node has been added to scene
            let verifyNode: THREE.Object3D | null = null;
            gltf.scene.traverse((node) => {
              if (node.name === "RallyBoard_Mount") {
                verifyNode = node;
              }
            });

            console.log(
              "✅ Created placement node RallyBoard_Mount at TV position (fallback):",
              {
                position: {
                  x: worldPosition.x,
                  y: worldPosition.y,
                  z: worldPosition.z,
                },
                nodeAdded: !!verifyNode,
                nodeInScene: verifyNode ? "✅ In scene" : "❌ Not in scene",
              }
            );

            // Force re-render PlacementNodesVisualizer
            setPlacementNodesUpdateKey((prev) => prev + 1);
          } else {
            console.warn(
              "⚠️ TV display mesh (tv_display_phonebooth) or TV node (Phonebooth_tv) not found"
            );
          }
        }
      } else {
        console.log("ℹ️ Placement node RallyBoard_Mount already exists");
      }

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
  // HIDE/SHOW TV BASED ON RALLYBOARD SELECTION
  // ============================================
  useEffect(() => {
    if (!gltf?.scene) return;

    // Check if RallyBoard is selected by checking Redux nodes mapping
    const rallyBoardMountNodeName =
      PlacementManager.getNameNodeForRallyBoardMount();
    const isRallyBoardSelected = nodes[rallyBoardMountNodeName] !== undefined;

    console.log("📺 [Room] Checking TV visibility:", {
      rallyBoardMountNodeName,
      isRallyBoardSelected,
      rallyBoardAssetId: nodes[rallyBoardMountNodeName],
      allNodes: Object.keys(nodes),
    });

    // Find ALL TV nodes/meshes in scene (comprehensive search)
    const tvNodes: THREE.Object3D[] = [];
    const tvMeshes: THREE.Mesh[] = [];
    const tvRelatedNames = [
      "Phonebooth_tv",
      "tv_display_phonebooth",
      "tv_body_phonebooth",
      "tv_mount_phonebooth",
      "TV",
      "Display",
      "TV_Mesh",
      "Display_Mesh",
    ];

    gltf.scene.traverse((node) => {
      // Find TV parent nodes
      if (
        tvRelatedNames.some(
          (name) => node.name.includes(name) || name === node.name
        )
      ) {
        if (node instanceof THREE.Object3D) {
          tvNodes.push(node);
        }
      }
      // Find TV meshes
      if (node instanceof THREE.Mesh) {
        if (
          tvRelatedNames.some(
            (name) =>
              node.name.toLowerCase().includes(name.toLowerCase()) ||
              node.name.toLowerCase().includes("tv") ||
              node.name.toLowerCase().includes("display")
          )
        ) {
          tvMeshes.push(node);
        }
      }
    });

    // Hide/show ALL TV nodes and meshes
    // Force set visibility (don't check previousVisible to ensure it's always updated)
    let hiddenCount = 0;
    tvNodes.forEach((tv) => {
      const previousVisible = tv.visible;
      const newVisible = !isRallyBoardSelected;
      tv.visible = newVisible;

      // Also hide all children recursively
      tv.traverse((child) => {
        child.visible = newVisible;
      });

      // Count if visibility actually changed
      if (previousVisible !== newVisible) {
        hiddenCount++;
      }
    });

    tvMeshes.forEach((mesh) => {
      const previousVisible = mesh.visible;
      const newVisible = !isRallyBoardSelected;
      mesh.visible = newVisible;

      // Count if visibility actually changed
      if (previousVisible !== newVisible) {
        hiddenCount++;
      }
    });

    // Force update: If RallyBoard is selected but hiddenCount is 0,
    // it means TV was already hidden - force hide again to be sure
    if (isRallyBoardSelected && hiddenCount === 0) {
      console.warn("⚠️ [Room] TV was already hidden, forcing hide again");
      tvNodes.forEach((tv) => {
        tv.visible = false;
        tv.traverse((child) => {
          child.visible = false;
        });
      });
      tvMeshes.forEach((mesh) => {
        mesh.visible = false;
      });
      hiddenCount = tvNodes.length + tvMeshes.length;
    }

    console.log("📺 [Room] TV visibility updated:", {
      isRallyBoardSelected,
      rallyBoardMountNodeName,
      rallyBoardAssetId: nodes[rallyBoardMountNodeName],
      tvNodesFound: tvNodes.length,
      tvMeshesFound: tvMeshes.length,
      hiddenCount,
      tvNodeNames: tvNodes.map((n) => n.name),
      tvMeshNames: tvMeshes.map((m) => m.name),
    });

    if (tvNodes.length === 0 && tvMeshes.length === 0) {
      console.warn(
        "⚠️ [Room] No TV nodes or meshes found in scene. TV might have different names."
      );
    }
  }, [gltf, nodes]);

  if (!gltf) return <></>;

  return (
    <>
      {three.camera && <primitive object={three.camera}></primitive>}
      <ambientLight intensity={1.5} color={"#ffffff"} />
      <GLTFNode threeNode={gltf.scene} nodeMatchers={ProductsNodes()} />
      <Dimension threeNode={gltf.scene} />
      <CameraRoom gltf={gltf} camera={three.camera} roomAssetId={roomAssetId} />

      {/* Visualize placement nodes - display in development */}
      {/* Temporarily disabled */}
      {false && process.env.NODE_ENV === "development" && gltf?.scene && (
        <PlacementNodesVisualizer
          key={placementNodesUpdateKey}
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
