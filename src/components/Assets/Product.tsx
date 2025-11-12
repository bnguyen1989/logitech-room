import { useAsset } from "@threekit/react-three-fiber";
import { useDispatch } from "react-redux";
import * as THREE from "three";
import { changeStatusProcessing } from "../../store/slices/configurator/Configurator.slice";
import { ProductsNodes } from "./ProductsNodes.js";
import { GLTFNode } from "./GLTFNode.js";
import { Select } from "@react-three/postprocessing";
import React, { useEffect, useMemo } from "react";
import { useAppSelector } from "../../hooks/redux.js";
import { getKeyPermissionFromNameNode } from "../../store/slices/configurator/selectors/selectors.js";
import { AnnotationProductContainer } from "../Annotation/AnnotationProduct/AnnotationContainer.js";
import { StepName } from "../../utils/baseUtils.js";
import { Configuration } from "@threekit/rest-api";
import { PlacementManager } from "../../models/configurator/PlacementManager.js";
import {
  useLocalAsset,
  useThreekitAsset,
  isLocalAsset,
  resolveAssetPath,
} from "../../utils/localAssetLoader.js";
import { getAssetId } from "../../store/slices/configurator/selectors/selectors.js";
// import { orientRallyBoard } from "../../utils/deviceOrientationUtils.js"; // Temporarily disabled - using manual rotation instead
import { DeviceAxesHelpers } from "./DeviceAxesHelpers.js";

export type ProductProps = {
  parentNode: THREE.Object3D;
  productAssetId: string;
  configuration: Configuration;
  highlight?: boolean;
  popuptNode?: boolean;
  callbackDisableHighlight: () => void;
  callbackOnHighlight: (nameNode: string) => void;
  callbackDisablePopuptNodes: () => void;
  callbackOnPopuptNodes: (nameNode: string) => void;
  nameNode: string;
};

const generateName = (nameNode: string, parentNode: THREE.Object3D): string => {
  return `${nameNode}-${parentNode.uuid}-group`;
};

export const Product: React.FC<ProductProps> = ({
  parentNode,
  productAssetId,
  configuration,
  highlight = false,
  popuptNode = false,
  callbackDisableHighlight = () => {},
  callbackOnHighlight = () => {},
  callbackDisablePopuptNodes = () => {},
  callbackOnPopuptNodes = () => {},
  nameNode,
}) => {
  const dispatch = useDispatch();

  // Get room assetId to use as fallback for Threekit hook (prevents fetch errors)
  const roomAssetId = useAppSelector(getAssetId);

  // Resolve assetId: check mapping or use directly
  const resolvedAssetId = resolveAssetPath(productAssetId);

  // Load from local file or Threekit (auto-detect)
  // We need to always call both hooks to comply with Rules of Hooks
  // But only use the result of one based on isLocal
  const isLocal = isLocalAsset(resolvedAssetId);

  console.log("🔍 [Product] Loading product:", {
    nameNode,
    productAssetId,
    resolvedAssetId,
    isLocal,
  });

  const localGltf = useLocalAsset(
    isLocal
      ? resolvedAssetId
      : "/assets/models/RallyBoard65_Standalone-compressed.glb"
  );
  // Use roomAssetId as fallback when loading local assets to prevent fetch errors
  const threekitGltf = useThreekitAsset(
    isLocal ? roomAssetId || "" : resolvedAssetId,
    useAsset,
    isLocal ? undefined : configuration
  );

  // Use local asset if isLocal, otherwise use Threekit asset
  // threekitGltf will be null if assetId is empty (local asset case)
  const productGltf = isLocal ? localGltf : threekitGltf || localGltf;

  console.log("📦 [Product] GLTF loaded:", {
    nameNode,
    hasLocalGltf: !!localGltf,
    hasThreekitGltf: !!threekitGltf,
    hasProductGltf: !!productGltf,
    isLocal,
    localGltfScene: localGltf?.scene ? "✅" : "❌",
    threekitGltfScene: threekitGltf?.scene ? "✅" : "❌",
  });

  const keyPermissionObj = useAppSelector(
    getKeyPermissionFromNameNode(nameNode)
  );

  useEffect(() => {
    if (!productGltf) return;
    const id = setTimeout(() => {
      callbackDisableHighlight();
    }, 3000);

    return () => clearTimeout(id);
  }, [productGltf, callbackDisableHighlight]);

  dispatch(changeStatusProcessing(false));

  // For RallyBoard: Center the GLB model at origin and scale it down if too large
  // Must call useMemo before early return to comply with Rules of Hooks
  const processedScene = useMemo(() => {
    if (!productGltf) return null;

    const clonedScene = productGltf.scene.clone();

    // Only process for RallyBoard_Mount
    if (nameNode === "RallyBoard_Mount") {
      // Calculate bounding box BEFORE any transformations
      const box = new THREE.Box3();
      box.setFromObject(clonedScene);
      const originalCenter = box.getCenter(new THREE.Vector3());
      const originalSize = box.getSize(new THREE.Vector3());

      // Scale down if too large (assuming room scale is in meters, GLB might be in cm)
      // If GLB is > 10 units in any dimension, scale it down
      const maxDimension = Math.max(
        originalSize.x,
        originalSize.y,
        originalSize.z
      );
      let scaleFactor = 1;
      if (maxDimension > 10) {
        // Scale down to reasonable size (assuming GLB is in cm, convert to meters)
        // Changed from 0.01 to 0.1 to make RallyBoard larger
        scaleFactor = 0.08; // cm to decimeters (10x larger than before)
        clonedScene.scale.multiplyScalar(scaleFactor);
      }

      // After scaling, recalculate bounding box and center
      // This ensures the pivot point is at the center of the scaled model
      const boxAfterScale = new THREE.Box3();
      boxAfterScale.setFromObject(clonedScene);
      const centerAfterScale = boxAfterScale.getCenter(new THREE.Vector3());

      // Center the scene at origin (pivot point = center of bounding box)
      // This ensures the model's center aligns with the placement node position
      clonedScene.position.sub(centerAfterScale);

      // Orient RallyBoard: Rotate front face towards room front
      // User confirmed: TV front face hướng về +Z trong world space
      // Vấn đề: RallyBoard nằm sau tường, bị lệch khỏi placement node
      // Giải pháp: Thử rotate 180 độ quanh X axis để flip front face

      // Rotate 180 độ quanh X axis để flip front face
      // Nếu RallyBoard GLB có front face hướng về -Z, rotate 180° quanh X sẽ flip thành +Z
      const flipRotation = new THREE.Euler(Math.PI, 0, 0); // 180° rotation around X axis
      clonedScene.rotation.copy(flipRotation);

      // ⭐ QUAN TRỌNG: Recalculate center sau khi rotate
      // Rotation có thể làm thay đổi bounding box, cần recalculate center
      const boxAfterRotate = new THREE.Box3();
      boxAfterRotate.setFromObject(clonedScene);
      const centerAfterRotate = boxAfterRotate.getCenter(new THREE.Vector3());

      // Adjust position để giữ center tại origin sau khi rotate
      clonedScene.position.sub(centerAfterRotate);

      console.log("🔄 [Product] RallyBoard rotated 180° around X axis:", {
        centerBeforeRotate: {
          x: centerAfterScale.x.toFixed(4),
          y: centerAfterScale.y.toFixed(4),
          z: centerAfterScale.z.toFixed(4),
          note: "Center sau khi scale, trước khi rotate",
        },
        rotation: {
          x: clonedScene.rotation.x,
          y: clonedScene.rotation.y,
          z: clonedScene.rotation.z,
        },
        rotationDegrees: {
          x: (clonedScene.rotation.x * 180) / Math.PI,
          y: (clonedScene.rotation.y * 180) / Math.PI,
          z: (clonedScene.rotation.z * 180) / Math.PI,
        },
        centerAfterRotate: {
          x: centerAfterRotate.x.toFixed(4),
          y: centerAfterRotate.y.toFixed(4),
          z: centerAfterRotate.z.toFixed(4),
          note: "Center sau khi rotate (trước khi adjust)",
        },
        finalPosition: {
          x: clonedScene.position.x.toFixed(4),
          y: clonedScene.position.y.toFixed(4),
          z: clonedScene.position.z.toFixed(4),
          note: "Final position sau khi adjust để giữ center tại origin",
        },
        note: "Rotated 180° around X to flip front face (thử để fix vấn đề nằm sau tường)",
      });

      // Alternative: Center each mesh individually (more precise but slower)
      // Uncomment if the above doesn't work correctly
      // clonedScene.traverse((child) => {
      //   if (child instanceof THREE.Mesh) {
      //     child.geometry.center();
      //   }
      // });

      console.log("🔧 [Product] RallyBoard scene processed:", {
        originalCenter: {
          x: originalCenter.x,
          y: originalCenter.y,
          z: originalCenter.z,
        },
        originalSize: {
          x: originalSize.x,
          y: originalSize.y,
          z: originalSize.z,
        },
        centerAfterScale: {
          x: centerAfterScale.x,
          y: centerAfterScale.y,
          z: centerAfterScale.z,
        },
        scaleFactor,
        finalPosition: {
          x: clonedScene.position.x,
          y: clonedScene.position.y,
          z: clonedScene.position.z,
        },
        pivotPoint: "center of bounding box",
      });
    }

    return clonedScene;
  }, [productGltf, nameNode]);

  // ============================================
  // TOGGLE AXES HELPERS FOR RALLYBOARD
  // ============================================
  // Set to true to show axes, false to hide
  // Change this value to toggle axes helpers on/off
  const ENABLE_AXES_HELPERS = true; // ⭐ CHANGE THIS: true = show, false = hide

  // Check if this is RallyBoard GLB by checking assetId or keyPermission
  // Must call useMemo before early return to comply with Rules of Hooks
  const isRallyBoardGLB = useMemo(() => {
    if (!ENABLE_AXES_HELPERS) return false;

    // Check by assetId (contains "rallyboard")
    const assetIdLower = (productAssetId || "").toLowerCase();
    const resolvedIdLower = (resolvedAssetId || "").toLowerCase();
    const isRallyBoardAsset =
      assetIdLower.includes("rallyboard") ||
      resolvedIdLower.includes("rallyboard");

    // Check by keyPermission (if available)
    const keyPermissions = keyPermissionObj
      ? Object.values(keyPermissionObj).flat()
      : [];
    const isRallyBoardPermission = keyPermissions.some((kp) =>
      kp?.toLowerCase().includes("rallyboard")
    );

    return isRallyBoardAsset || isRallyBoardPermission;
  }, [ENABLE_AXES_HELPERS, productAssetId, resolvedAssetId, keyPermissionObj]);

  const showAxesHelpers = isRallyBoardGLB;

  // Guard against null productGltf (after all hooks are called)
  if (!productGltf || !processedScene) {
    console.error(
      "❌ [Product] Failed to load GLTF for assetId:",
      resolvedAssetId
    );
    return null;
  }

  const sizeProduct = new THREE.Box3()
    .setFromObject(processedScene.clone())
    .getSize(new THREE.Vector3());

  // Debug log for RallyBoard rendering
  if (nameNode === "RallyBoard_Mount") {
    // Count meshes in GLB scene
    let meshCount = 0;
    processedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshCount++;
      }
    });

    // Get bounding box center
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(processedScene.clone());
    const center = boundingBox.getCenter(new THREE.Vector3());

    console.log("🎨 [Product] Rendering RallyBoard:", {
      nameNode,
      parentNodePosition: {
        x: parentNode.position.x,
        y: parentNode.position.y,
        z: parentNode.position.z,
      },
      parentNodeScale: {
        x: parentNode.scale.x,
        y: parentNode.scale.y,
        z: parentNode.scale.z,
      },
      parentNodeRotation: {
        x: parentNode.rotation.x,
        y: parentNode.rotation.y,
        z: parentNode.rotation.z,
      },
      glbSize: {
        x: sizeProduct.x,
        y: sizeProduct.y,
        z: sizeProduct.z,
      },
      glbCenter: {
        x: center.x,
        y: center.y,
        z: center.z,
      },
      meshCount,
      hasScene: !!processedScene,
      sceneChildren: processedScene.children.length,
    });
  }

  return (
    <group
      key={parentNode.uuid + `-group`}
      name={generateName(nameNode, parentNode)}
      position={parentNode.position}
      scale={parentNode.scale}
      rotation={parentNode.rotation}
    >
      {/* Debug marker for RallyBoard - shows placement node position */}
      {nameNode === "RallyBoard_Mount" && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#00ff00"
            emissive="#00ff00"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Axes helpers - Local and World coordinate systems */}
      {/* Easy to toggle: change showAxesHelpers variable above */}
      {showAxesHelpers && (
        <DeviceAxesHelpers
          showLocal={true} // Show device's local axes (Red=X, Green=Y, Blue=Z)
          showWorld={true} // Show world axes (Cyan=X, Yellow=Y, Magenta=Z)
          size={2.0} // Size of axes arrows (increased for better visibility)
        />
      )}

      {PlacementManager.getNameNodeWithoutInteraction().includes(nameNode) ? (
        <GLTFNode
          threeNode={processedScene}
          nodeMatchers={ProductsNodes({ isRallyBoardSelected: false })}
        />
      ) : (
        <Select
          enabled={highlight}
          onClick={() => {
            callbackOnHighlight(nameNode);
            callbackOnPopuptNodes(nameNode);
          }}
        >
          {popuptNode &&
            keyPermissionObj !== undefined &&
            Object.keys(keyPermissionObj).length > 0 && (
              <AnnotationProductContainer
                stepPermission={Object.keys(keyPermissionObj)[0] as StepName}
                keyPermissions={Object.values(keyPermissionObj)[0]}
                position={[0, sizeProduct.y / 2, 0]}
                callbackDisablePopuptNodes={callbackDisablePopuptNodes}
              />
            )}
          <GLTFNode
            threeNode={processedScene}
            nodeMatchers={ProductsNodes({ isRallyBoardSelected: false })}
          />
        </Select>
      )}
    </group>
  );
};
