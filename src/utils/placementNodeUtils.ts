/**
 * Utility functions to create placement nodes dynamically
 *
 * These functions help create placement nodes for devices that need to mount on wall to replace TV
 */

import * as THREE from "three";
import { PlacementManager } from "../models/configurator/PlacementManager";

export function findTVMesh(
  scene: THREE.Scene | THREE.Group
): THREE.Object3D | null {
  let tvMesh: THREE.Object3D | null = null;

  scene.traverse((node) => {
    // Check common TV node names (case insensitive)
    const nodeNameLower = node.name.toLowerCase();
    if (nodeNameLower.includes("tv")) {
      tvMesh = node;
    }
  });

  return tvMesh;
}

/**
 * Calculate center position and rotation of a mesh
 *
 * @param mesh - THREE.Object3D to calculate center from
 * @returns Object with position (center position) and quaternion (rotation)
 */
export function calculateCenterTransform(mesh: THREE.Object3D): {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
} {
  // Get world position and rotation
  const worldPosition = new THREE.Vector3();
  const worldQuaternion = new THREE.Quaternion();
  const worldScale = new THREE.Vector3();

  mesh.matrixWorld.decompose(worldPosition, worldQuaternion, worldScale);

  // Calculate bounding box to find center
  // box.setFromObject() already calculates in world space
  const box = new THREE.Box3();
  box.setFromObject(mesh);

  // Get center of bounding box (already in world space)
  const center = box.getCenter(new THREE.Vector3());

  return {
    position: center,
    quaternion: worldQuaternion,
  };
}

/**
 * Create placement node for device mount to replace TV
 *
 * This creates a placement node at the TV center position
 * Can be used by any device that needs to mount to replace TV (RallyBoard, etc.)
 *
 * @param scene - THREE.Scene or THREE.Group from GLTF
 * @param nodeName - Name of the placement node (default: "Device_Mount")
 * @returns Placement node if created, null if TV not found
 */
export function createDeviceMountPlacementNode(
  scene: THREE.Scene | THREE.Group,
  nodeName: string = PlacementManager.getNameNodeForDeviceMount()
): THREE.Object3D | null {
  // Find TV mesh
  const tvMesh = findTVMesh(scene);
  if (!tvMesh) {
    console.warn(
      `⚠️ [createDeviceMountPlacementNode] TV mesh not found in scene. Cannot create placement node: ${nodeName}`
    );
    return null;
  }

  // Calculate center transform (center of TV)
  const { position, quaternion } = calculateCenterTransform(tvMesh);

  // Create placement node
  const placementNode = new THREE.Object3D();
  placementNode.name = nodeName;

  // Set position: TV center position
  placementNode.position.copy(position);

  // Set rotation: TV rotation (keep same rotation as TV)
  placementNode.quaternion.copy(quaternion);

  // Set scale
  placementNode.scale.set(1, 1, 1);

  // Add to scene
  scene.add(placementNode);

  console.log(
    `✅ [createDeviceMountPlacementNode] Created placement node: ${nodeName}`,
    {
      position: placementNode.position,
      rotation: placementNode.rotation,
      scale: placementNode.scale,
    }
  );

  return placementNode;
}
