import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import DimensionBetweenNodes from "./DimensionBetweenNodes";
import { useAppSelector } from "../../hooks/redux";
import { getDimensionEnabled } from "../../store/slices/configurator/selectors/selectors";
import { getDimensionNodeData } from "../../store/slices/configurator/selectors/dimensionSelectors";

interface PropsI {
  threeNode: THREE.Object3D;
  changeCamera: (type: "Main" | "Dimension") => void;
}

export const Dimension: React.FC<PropsI> = ({ threeNode, changeCamera }) => {
  const dimensionNodes = useAppSelector(getDimensionNodeData);
  const enabled = useAppSelector(getDimensionEnabled);
  console.log(dimensionNodes);

  const nodeMap: Record<string, THREE.Mesh | undefined> = useMemo(() => {
    const map: Record<string, THREE.Mesh | undefined> = {};

    const traverse = (object: THREE.Object3D) => {
      if (object.name) {
        map[object.name] = object as THREE.Mesh;
      }
      object.children.forEach(traverse);
    };

    traverse(threeNode);
    return map;
  }, [threeNode]);

  useEffect(() => {
    if (enabled) {
      changeCamera("Dimension");
    } else {
      changeCamera("Main");
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {dimensionNodes.map(
        ({ nodeAName, nodeBName, label, offsetPosition }, index) => {
          const nodeA = nodeMap[nodeAName];
          const nodeB = nodeMap[nodeBName];

          if (!nodeA || !nodeB) return null;

          return (
            <DimensionBetweenNodes
              key={index}
              nodeA={nodeA}
              nodeB={nodeB}
              label={label}
              offsetPosition={offsetPosition}
            />
          );
        }
      )}
    </>
  );
};
