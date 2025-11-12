import { useMemo } from "react";
import * as THREE from "three";
import { PlacementManager } from "../../models/configurator/PlacementManager";
import { Html } from "@react-three/drei";

interface PlacementNodesVisualizerProps {
  scene: THREE.Object3D;
  enabled?: boolean;
  showLabels?: boolean;
  markerSize?: number;
  markerColor?: string;
}

/**
 * Component to display positions of all placement nodes in the scene
 * Helps debug and visualize positions where products can be attached
 */
export const PlacementNodesVisualizer: React.FC<
  PlacementNodesVisualizerProps
> = ({
  scene,
  enabled = true,
  showLabels = true,
  markerSize = 0.1,
  markerColor = "#ff0000",
}) => {
  // Find all placement nodes in the scene
  const placementNodes = useMemo(() => {
    if (!scene || !enabled) return [];

    try {
      const allPlacements = PlacementManager.getAllPlacement();
      console.log("🔍 PlacementNodesVisualizer - Looking for nodes:", {
        totalPlacements: allPlacements.length,
        firstFew: allPlacements.slice(0, 5),
      });

      const nodes: Array<{
        node: THREE.Object3D;
        name: string;
        worldPosition: THREE.Vector3;
      }> = [];

      const allNodeNames: string[] = [];
      scene.traverse((node) => {
        if (node.name) {
          allNodeNames.push(node.name);
          if (allPlacements.includes(node.name)) {
            // Calculate world position (taking into account parent transforms)
            const worldPosition = new THREE.Vector3();
            node.getWorldPosition(worldPosition);

            nodes.push({
              node,
              name: node.name,
              worldPosition,
            });
          }
        }
      });

      console.log("🔍 PlacementNodesVisualizer - Found nodes:", {
        found: nodes.length,
        nodeNames: nodes.map((n) => n.name),
        totalNodesInScene: allNodeNames.length,
        sampleSceneNodes: allNodeNames.slice(0, 10),
      });

      return nodes;
    } catch (error) {
      console.warn("Error finding placement nodes:", error);
      return [];
    }
  }, [scene, enabled]);

  if (!enabled || placementNodes.length === 0) {
    return null;
  }

  return (
    <>
      {placementNodes.map(({ name, worldPosition }) => (
        <group key={name} position={worldPosition}>
          {/* Marker: Red sphere */}
          <mesh>
            <sphereGeometry args={[markerSize, 16, 16]} />
            <meshStandardMaterial
              color={markerColor}
              emissive={markerColor}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Label: Display node name */}
          {showLabels && (
            <Html
              position={[0, markerSize + 0.05, 0]}
              center
              style={{
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.8)",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  whiteSpace: "nowrap",
                  border: `1px solid ${markerColor}`,
                }}
              >
                {name}
              </div>
            </Html>
          )}

          {/* Axes helper: Display orientation */}
          <axesHelper args={[markerSize * 2]} />
        </group>
      ))}
    </>
  );
};
