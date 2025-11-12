/**
 * Utility to determine device front face and orient it correctly
 *
 * Features:
 * 1. Detect front face of device using geometry analysis
 * 2. Rotate device so front face points towards room front (not wall)
 * 3. Add local and world axes helpers for visualization
 *
 * Usage:
 * ```typescript
 * import { orientDeviceToRoomFront, addAxesHelpers } from './deviceOrientationUtils';
 *
 * // Orient device
 * const orientedScene = orientDeviceToRoomFront(scene, {
 *   deviceType: 'RallyBoard',
 *   roomFrontDirection: new THREE.Vector3(0, 0, -1),
 * });
 *
 * // Add axes helpers (optional, for debugging)
 * addAxesHelpers(scene, { showLocal: true, showWorld: true });
 * ```
 */

import * as THREE from "three";

export type DeviceType = "RallyBoard" | "Camera" | "Display" | "Generic";

export interface OrientDeviceOptions {
  /**
   * Type of device (affects front face detection strategy)
   */
  deviceType?: DeviceType;

  /**
   * Direction vector pointing to room front (where users/camera look)
   * Default: -Z (negative Z axis)
   * Common values:
   * - new THREE.Vector3(0, 0, -1) for -Z front (most common)
   * - new THREE.Vector3(0, 0, 1) for +Z front
   * - new THREE.Vector3(-1, 0, 0) for -X front
   * - new THREE.Vector3(1, 0, 0) for +X front
   */
  roomFrontDirection?: THREE.Vector3;

  /**
   * Custom front face detection function
   * If provided, this will be used instead of default detection
   */
  customFrontFaceDetector?: (scene: THREE.Object3D) => THREE.Vector3;

  /**
   * Debug mode - logs detailed information
   */
  debug?: boolean;
}

export interface AxesHelpersOptions {
  /**
   * Show local axes (device's own coordinate system)
   */
  showLocal?: boolean;

  /**
   * Show world axes (room's coordinate system)
   */
  showWorld?: boolean;

  /**
   * Size of axes helpers
   */
  size?: number;

  /**
   * Color for local axes (default: red=X, green=Y, blue=Z)
   */
  localColors?: {
    x?: string;
    y?: string;
    z?: string;
  };

  /**
   * Color for world axes (default: cyan=X, yellow=Y, magenta=Z)
   */
  worldColors?: {
    x?: string;
    y?: string;
    z?: string;
  };
}

/**
 * Analyze geometry to find front face direction
 *
 * Strategy:
 * 1. Find all meshes in the scene
 * 2. Analyze face normals to determine which direction faces "outward"
 * 3. For displays/devices, the face with most outward-facing normals is usually the front
 *
 * @param scene - The 3D scene/object to analyze
 * @param deviceType - Type of device
 * @returns Normal vector pointing in the front face direction
 */
export function detectFrontFaceFromGeometry(
  scene: THREE.Object3D,
  deviceType: DeviceType = "Generic"
): THREE.Vector3 {
  const normalCounts = {
    x: { positive: 0, negative: 0 },
    y: { positive: 0, negative: 0 },
    z: { positive: 0, negative: 0 },
  };

  // Traverse all meshes and analyze face normals
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const geometry = child.geometry;

      // Get position attribute
      const positionAttribute = geometry.attributes.position;
      if (!positionAttribute) return;

      // Get normal attribute (if exists)
      const normalAttribute = geometry.attributes.normal;

      if (normalAttribute) {
        // Use existing normals
        for (let i = 0; i < normalAttribute.count; i++) {
          const nx = normalAttribute.getX(i);
          const ny = normalAttribute.getY(i);
          const nz = normalAttribute.getZ(i);

          // Count normals pointing in each direction
          if (Math.abs(nx) > Math.abs(ny) && Math.abs(nx) > Math.abs(nz)) {
            if (nx > 0) normalCounts.x.positive++;
            else normalCounts.x.negative++;
          } else if (
            Math.abs(ny) > Math.abs(nx) &&
            Math.abs(ny) > Math.abs(nz)
          ) {
            if (ny > 0) normalCounts.y.positive++;
            else normalCounts.y.negative++;
          } else if (
            Math.abs(nz) > Math.abs(nx) &&
            Math.abs(nz) > Math.abs(ny)
          ) {
            if (nz > 0) normalCounts.z.positive++;
            else normalCounts.z.negative++;
          }
        }
      } else {
        // Calculate normals from geometry
        geometry.computeVertexNormals();
        const computedNormals = geometry.attributes.normal;
        if (computedNormals) {
          for (let i = 0; i < computedNormals.count; i++) {
            const nx = computedNormals.getX(i);
            const ny = computedNormals.getY(i);
            const nz = computedNormals.getZ(i);

            if (Math.abs(nx) > Math.abs(ny) && Math.abs(nx) > Math.abs(nz)) {
              if (nx > 0) normalCounts.x.positive++;
              else normalCounts.x.negative++;
            } else if (
              Math.abs(ny) > Math.abs(nx) &&
              Math.abs(ny) > Math.abs(nz)
            ) {
              if (ny > 0) normalCounts.y.positive++;
              else normalCounts.y.negative++;
            } else if (
              Math.abs(nz) > Math.abs(nx) &&
              Math.abs(nz) > Math.abs(ny)
            ) {
              if (nz > 0) normalCounts.z.positive++;
              else normalCounts.z.negative++;
            }
          }
        }
      }
    }
  });

  // Determine front face based on normal counts
  // Front face usually has most outward-facing normals
  let frontDirection = new THREE.Vector3(0, 0, -1); // Default: -Z

  // Find direction with most outward normals
  const maxX = Math.max(normalCounts.x.positive, normalCounts.x.negative);
  const maxY = Math.max(normalCounts.y.positive, normalCounts.y.negative);
  const maxZ = Math.max(normalCounts.z.positive, normalCounts.z.negative);

  const maxCount = Math.max(maxX, maxY, maxZ);

  if (maxCount === maxZ) {
    // Z direction has most normals
    frontDirection =
      normalCounts.z.positive > normalCounts.z.negative
        ? new THREE.Vector3(0, 0, 1) // +Z
        : new THREE.Vector3(0, 0, -1); // -Z (most common for displays)
  } else if (maxCount === maxX) {
    // X direction has most normals
    frontDirection =
      normalCounts.x.positive > normalCounts.x.negative
        ? new THREE.Vector3(1, 0, 0) // +X
        : new THREE.Vector3(-1, 0, 0); // -X
  } else if (maxCount === maxY) {
    // Y direction has most normals (unusual for devices)
    frontDirection =
      normalCounts.y.positive > normalCounts.y.negative
        ? new THREE.Vector3(0, 1, 0) // +Y (up)
        : new THREE.Vector3(0, -1, 0); // -Y (down)
  }

  // Device-specific overrides
  switch (deviceType) {
    case "RallyBoard":
    case "Display":
      // Displays usually face -Z (negative Z)
      // If detected direction is +Z, flip it
      if (frontDirection.z > 0) {
        frontDirection = new THREE.Vector3(0, 0, -1);
      }
      break;
    case "Camera":
      // Camera lens usually faces -Z
      frontDirection = new THREE.Vector3(0, 0, -1);
      break;
  }

  return frontDirection;
}

/**
 * Detect front face using bounding box analysis (fallback method)
 */
export function detectFrontFaceFromBoundingBox(
  scene: THREE.Object3D,
  deviceType: DeviceType = "Generic"
): THREE.Vector3 {
  const box = new THREE.Box3();
  box.setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());

  // Calculate face areas
  const faceAreas = {
    x: size.y * size.z,
    y: size.x * size.z,
    z: size.x * size.y,
  };

  // Largest face is usually front/back
  const maxArea = Math.max(faceAreas.x, faceAreas.y, faceAreas.z);

  let frontDirection = new THREE.Vector3(0, 0, -1);

  if (maxArea === faceAreas.z) {
    frontDirection = new THREE.Vector3(0, 0, -1);
  } else if (maxArea === faceAreas.x) {
    frontDirection = new THREE.Vector3(-1, 0, 0);
  }

  return frontDirection;
}

/**
 * Calculate rotation quaternion to align device front with room front
 */
export function calculateRotationQuaternion(
  deviceFrontDirection: THREE.Vector3,
  roomFrontDirection: THREE.Vector3
): THREE.Quaternion {
  const deviceDir = deviceFrontDirection.clone().normalize();
  const roomDir = roomFrontDirection.clone().normalize();

  // Calculate rotation quaternion
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(deviceDir, roomDir);

  return quaternion;
}

/**
 * Orient device so its front face points towards room front (not wall)
 *
 * @param scene - The 3D scene/object to orient
 * @param options - Configuration options
 * @returns The oriented scene (mutates original scene)
 */
export function orientDeviceToRoomFront(
  scene: THREE.Object3D,
  options: OrientDeviceOptions = {}
): THREE.Object3D {
  const {
    deviceType = "Generic",
    roomFrontDirection = new THREE.Vector3(0, 0, -1),
    customFrontFaceDetector,
    debug = false,
  } = options;

  // Detect front face (try geometry first, fallback to bounding box)
  let deviceFrontDirection: THREE.Vector3;

  if (customFrontFaceDetector) {
    deviceFrontDirection = customFrontFaceDetector(scene);
  } else {
    // Try geometry-based detection first
    deviceFrontDirection = detectFrontFaceFromGeometry(scene, deviceType);

    // If geometry detection fails (no normals), use bounding box
    if (deviceFrontDirection.length() === 0) {
      deviceFrontDirection = detectFrontFaceFromBoundingBox(scene, deviceType);
    }
  }

  if (debug) {
    console.log("🔍 [DeviceOrientation] Front face detection:", {
      deviceType,
      deviceFrontDirection: {
        x: deviceFrontDirection.x,
        y: deviceFrontDirection.y,
        z: deviceFrontDirection.z,
      },
      roomFrontDirection: {
        x: roomFrontDirection.x,
        y: roomFrontDirection.y,
        z: roomFrontDirection.z,
      },
    });
  }

  // Calculate rotation needed
  const rotationQuaternion = calculateRotationQuaternion(
    deviceFrontDirection,
    roomFrontDirection
  );

  // Convert to Euler for easier debugging
  const euler = new THREE.Euler();
  euler.setFromQuaternion(rotationQuaternion);

  if (debug) {
    console.log("🔄 [DeviceOrientation] Rotation calculated:", {
      quaternion: {
        x: rotationQuaternion.x,
        y: rotationQuaternion.y,
        z: rotationQuaternion.z,
        w: rotationQuaternion.w,
      },
      euler: {
        x: euler.x,
        y: euler.y,
        z: euler.z,
      },
      eulerDegrees: {
        x: (euler.x * 180) / Math.PI,
        y: (euler.y * 180) / Math.PI,
        z: (euler.z * 180) / Math.PI,
      },
    });
  }

  // Apply rotation to scene
  // Use quaternion for more accurate rotation
  scene.quaternion.multiplyQuaternions(rotationQuaternion, scene.quaternion);

  if (debug) {
    const finalEuler = new THREE.Euler();
    finalEuler.setFromQuaternion(scene.quaternion);
    console.log("✅ [DeviceOrientation] Device oriented:", {
      finalQuaternion: {
        x: scene.quaternion.x,
        y: scene.quaternion.y,
        z: scene.quaternion.z,
        w: scene.quaternion.w,
      },
      finalEuler: {
        x: finalEuler.x,
        y: finalEuler.y,
        z: finalEuler.z,
      },
      finalEulerDegrees: {
        x: (finalEuler.x * 180) / Math.PI,
        y: (finalEuler.y * 180) / Math.PI,
        z: (finalEuler.z * 180) / Math.PI,
      },
    });
  }

  return scene;
}

/**
 * Add axes helpers to visualize local and world coordinate systems
 *
 * @param scene - The scene to add axes to
 * @param options - Configuration options
 */
export function addAxesHelpers(
  scene: THREE.Object3D,
  options: AxesHelpersOptions = {}
): void {
  const {
    showLocal = true,
    showWorld = false,
    size = 0.5,
    localColors = { x: "#ff0000", y: "#00ff00", z: "#0000ff" },
    worldColors = { x: "#00ffff", y: "#ffff00", z: "#ff00ff" },
  } = options;

  // Remove existing axes helpers if any
  const existingHelpers: THREE.Object3D[] = [];
  scene.traverse((child) => {
    if (child.name === "localAxesHelper" || child.name === "worldAxesHelper") {
      existingHelpers.push(child);
    }
  });
  existingHelpers.forEach((helper) => {
    scene.remove(helper);
    if (helper instanceof THREE.Object3D) {
      helper.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }
  });

  // Add local axes (device's coordinate system)
  if (showLocal) {
    const localAxesGroup = new THREE.Group();
    localAxesGroup.name = "localAxesHelper";

    // X axis (red)
    const xAxis = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      size,
      localColors.x || "#ff0000",
      size * 0.2,
      size * 0.1
    );
    xAxis.name = "localXAxis";
    localAxesGroup.add(xAxis);

    // Y axis (green)
    const yAxis = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      size,
      localColors.y || "#00ff00",
      size * 0.2,
      size * 0.1
    );
    yAxis.name = "localYAxis";
    localAxesGroup.add(yAxis);

    // Z axis (blue)
    const zAxis = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      size,
      localColors.z || "#0000ff",
      size * 0.2,
      size * 0.1
    );
    zAxis.name = "localZAxis";
    localAxesGroup.add(zAxis);

    scene.add(localAxesGroup);
  }

  // Add world axes (room's coordinate system)
  if (showWorld) {
    const worldAxesGroup = new THREE.Group();
    worldAxesGroup.name = "worldAxesHelper";

    // World axes are always at origin, not affected by scene transforms
    // X axis (cyan)
    const worldXAxis = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      size * 1.5,
      worldColors.x || "#00ffff",
      size * 0.3,
      size * 0.15
    );
    worldXAxis.name = "worldXAxis";
    worldAxesGroup.add(worldXAxis);

    // Y axis (yellow)
    const worldYAxis = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      size * 1.5,
      worldColors.y || "#ffff00",
      size * 0.3,
      size * 0.15
    );
    worldYAxis.name = "worldYAxis";
    worldAxesGroup.add(worldYAxis);

    // Z axis (magenta)
    const worldZAxis = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      size * 1.5,
      worldColors.z || "#ff00ff",
      size * 0.3,
      size * 0.15
    );
    worldZAxis.name = "worldZAxis";
    worldAxesGroup.add(worldZAxis);

    scene.add(worldAxesGroup);
  }
}

/**
 * Quick helper: Orient RallyBoard to face room front
 */
export function orientRallyBoard(
  scene: THREE.Object3D,
  roomFrontDirection: THREE.Vector3 = new THREE.Vector3(0, 0, -1),
  debug: boolean = false
): THREE.Object3D {
  return orientDeviceToRoomFront(scene, {
    deviceType: "RallyBoard",
    roomFrontDirection,
    debug,
  });
}

/**
 * Quick helper: Orient generic device to face room front
 */
export function orientGenericDevice(
  scene: THREE.Object3D,
  roomFrontDirection: THREE.Vector3 = new THREE.Vector3(0, 0, -1),
  debug: boolean = false
): THREE.Object3D {
  return orientDeviceToRoomFront(scene, {
    deviceType: "Generic",
    roomFrontDirection,
    debug,
  });
}
