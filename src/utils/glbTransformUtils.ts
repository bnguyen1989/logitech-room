import * as THREE from "three";

export type TargetSize =
  | number
  | {
      x?: number;
      y?: number;
      z?: number;
    };

export type RotationOptions = {
  /**
   * Rotation in radians
   */
  x?: number;
  y?: number;
  z?: number;
  /**
   * Optional Euler order (default: "XYZ")
   */
  order?: THREE.EulerOrder;
};

export interface NormalizeGLBOptions {
  /**
   * Center the GLB at the origin (default: true)
   */
  center?: boolean;
  /**
   * Scale the GLB so that its largest dimension matches targetSize.
   * Accepts a number (uniform) or an object for axis-specific targets.
   */
  targetSize?: TargetSize;
  /**
   * Apply a manual scale multiplier AFTER the targetSize normalization.
   */
  scaleMultiplier?: number | THREE.Vector3;
  /**
   * Rotate the GLB around its origin.
   */
  rotation?: RotationOptions;
  /**
   * Whether to clone the incoming Object3D before mutating (default: true).
   */
  cloneBeforeTransform?: boolean;
}

/**
 * Clones an Object3D if requested (default) to avoid mutating the caller's reference.
 */
const cloneIfNeeded = <T extends THREE.Object3D>(
  object: T,
  shouldClone: boolean = true
): T => {
  return shouldClone ? (object.clone(true) as T) : object;
};

/**
 * Centers the provided object so that its bounding-box center sits on the origin.
 */
export const centerObject3D = (object: THREE.Object3D): void => {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());

  object.position.sub(center);
  object.updateMatrixWorld(true);
};

/**
 * Scales the object uniformly (or per-axis) so that its bounding box fits the provided size.
 */
export const scaleObject3D = (
  object: THREE.Object3D,
  targetSize: TargetSize
): void => {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());

  if (typeof targetSize === "number") {
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scaleFactor = maxDimension === 0 ? 1 : targetSize / maxDimension;
    object.scale.multiplyScalar(scaleFactor);
    return;
  }

  const desiredSize = {
    x: targetSize.x ?? size.x,
    y: targetSize.y ?? size.y,
    z: targetSize.z ?? size.z,
  };

  const scale = new THREE.Vector3(
    size.x === 0 ? 1 : desiredSize.x / size.x,
    size.y === 0 ? 1 : desiredSize.y / size.y,
    size.z === 0 ? 1 : desiredSize.z / size.z
  );

  object.scale.multiply(scale);
};

/**
 * Applies rotation (in radians) to the object.
 */
export const rotateObject3D = (
  object: THREE.Object3D,
  rotation: RotationOptions
): void => {
  const { x = 0, y = 0, z = 0, order = "XYZ" } = rotation;

  const euler = new THREE.Euler(x, y, z, order);
  object.rotateX(euler.x);
  object.rotateY(euler.y);
  object.rotateZ(euler.z);
};

/**
 * Applies a custom scale multiplier as the final step.
 */
const applyScaleMultiplier = (
  object: THREE.Object3D,
  multiplier?: number | THREE.Vector3
): void => {
  if (!multiplier) return;

  if (typeof multiplier === "number") {
    object.scale.multiplyScalar(multiplier);
    return;
  }

  object.scale.multiply(multiplier);
};

/**
 * Utility to normalize a GLB/GLTF scene:
 * - optionally clone the scene
 * - center it
 * - resize it
 * - apply rotation
 */
export const normalizeGLBScene = (
  scene: THREE.Object3D,
  options: NormalizeGLBOptions = {}
): THREE.Object3D => {
  const {
    center = true,
    targetSize,
    scaleMultiplier,
    rotation,
    cloneBeforeTransform = true,
  } = options;

  const normalizedScene = cloneIfNeeded(scene, cloneBeforeTransform);

  if (center) {
    centerObject3D(normalizedScene);
  }

  if (targetSize !== undefined) {
    scaleObject3D(normalizedScene, targetSize);
  }

  if (scaleMultiplier !== undefined) {
    applyScaleMultiplier(normalizedScene, scaleMultiplier);
  }

  if (rotation) {
    rotateObject3D(normalizedScene, rotation);
  }

  return normalizedScene;
};
