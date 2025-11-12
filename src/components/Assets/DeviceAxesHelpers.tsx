/**
 * React component to display local and world axes helpers for devices
 *
 * Usage:
 * ```tsx
 * <DeviceAxesHelpers
 *   showLocal={true}
 *   showWorld={true}
 *   size={0.5}
 * />
 * ```
 */

import React, { useMemo } from "react";
import * as THREE from "three";

export interface DeviceAxesHelpersProps {
  /**
   * Show local axes (device's own coordinate system)
   * Red=X, Green=Y, Blue=Z
   */
  showLocal?: boolean;

  /**
   * Show world axes (room's coordinate system)
   * Cyan=X, Yellow=Y, Magenta=Z
   */
  showWorld?: boolean;

  /**
   * Size of axes helpers
   */
  size?: number;

  /**
   * Color for local axes
   */
  localColors?: {
    x?: string;
    y?: string;
    z?: string;
  };

  /**
   * Color for world axes
   */
  worldColors?: {
    x?: string;
    y?: string;
    z?: string;
  };
}

/**
 * Component to render axes helpers using React Three Fiber
 * Uses primitive to render Three.js ArrowHelper objects
 */
export const DeviceAxesHelpers: React.FC<DeviceAxesHelpersProps> = ({
  showLocal = true,
  showWorld = false,
  size = 0.5,
  localColors = { x: "#ff0000", y: "#00ff00", z: "#0000ff" },
  worldColors = { x: "#00ffff", y: "#ffff00", z: "#ff00ff" },
}) => {
  // Create ArrowHelper objects using useMemo to avoid recreating on every render
  const localAxes = useMemo(() => {
    if (!showLocal) return null;

    const xAxis = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      size,
      localColors.x || "#ff0000",
      size * 0.2,
      size * 0.1
    );
    xAxis.name = "localXAxis";

    // Y axis - make it more visible with brighter color and slightly larger
    const yAxis = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      size * 1.2, // Make Y axis 20% longer for better visibility
      "#00ff00", // Bright green
      size * 0.25, // Larger head
      size * 0.12 // Larger shaft
    );
    yAxis.name = "localYAxis";

    const zAxis = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      size,
      localColors.z || "#0000ff",
      size * 0.2,
      size * 0.1
    );
    zAxis.name = "localZAxis";

    return { xAxis, yAxis, zAxis };
  }, [showLocal, size, localColors.x, localColors.y, localColors.z]);

  const worldAxes = useMemo(() => {
    if (!showWorld) return null;

    const xAxis = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      size * 1.5,
      worldColors.x || "#00ffff",
      size * 0.3,
      size * 0.15
    );
    xAxis.name = "worldXAxis";

    const yAxis = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      size * 1.5,
      worldColors.y || "#ffff00",
      size * 0.3,
      size * 0.15
    );
    yAxis.name = "worldYAxis";

    const zAxis = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      size * 1.5,
      worldColors.z || "#ff00ff",
      size * 0.3,
      size * 0.15
    );
    zAxis.name = "worldZAxis";

    return { xAxis, yAxis, zAxis };
  }, [showWorld, size, worldColors.x, worldColors.y, worldColors.z]);

  return (
    <>
      {/* Local axes - device's coordinate system */}
      {localAxes && (
        <group name="localAxesHelper">
          <primitive object={localAxes.xAxis} />
          <primitive object={localAxes.yAxis} />
          <primitive object={localAxes.zAxis} />
        </group>
      )}

      {/* World axes - room's coordinate system */}
      {worldAxes && (
        <group name="worldAxesHelper">
          <primitive object={worldAxes.xAxis} />
          <primitive object={worldAxes.yAxis} />
          <primitive object={worldAxes.zAxis} />
        </group>
      )}
    </>
  );
};
