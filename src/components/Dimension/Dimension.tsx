import React, { useMemo } from "react";
import * as THREE from "three";
import DimensionBetweenNodes from "./DimensionBetweenNodes";
import { useAppSelector } from "../../hooks/redux";
import {
  getDimensionEnabled,
  getDimensionNodes,
} from "../../store/slices/configurator/selectors/selectors";

interface PropsI {
  threeNode: THREE.Object3D;
}

export const Dimension: React.FC<PropsI> = ({ threeNode }) => {
  const dimensionNodes = useAppSelector(getDimensionNodes);
  const enabled = useAppSelector(getDimensionEnabled);

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

  if (!enabled) return null;

  return (
    <>
      {dimensionNodes.map(({ nodeAName, nodeBName, label }, index) => {
        const nodeA = nodeMap[nodeAName];
        const nodeB = nodeMap[nodeBName];

        if (!nodeA || !nodeB) return null;

        return (
          <DimensionBetweenNodes
            key={index}
            nodeA={nodeA}
            nodeB={nodeB}
            label={label}
          />
        );
      })}
    </>
  );
};
