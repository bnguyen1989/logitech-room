import React, { useMemo } from "react";
import * as THREE from "three";
import DimensionBetweenNodes from "./DimensionBetweenNodes";

interface PropsI {
  threeNode: THREE.Object3D;
  lines: string[][]; // Каждая строка — это массив из двух имен узлов [nodeAName, nodeBName]
}

export const Dimension: React.FC<PropsI> = ({ threeNode, lines }) => {
  // Создание словаря узлов
  const nodeMap: Record<string, THREE.Mesh | undefined> = useMemo(() => {
    const map: Record<string, THREE.Mesh | undefined> = {};

    const traverse = (object: THREE.Object3D) => {
      if (object.name) {
        map[object.name] = object as THREE.Mesh;
      }
      object.children.forEach(traverse);
    };

    traverse(threeNode); // Рекурсивно обходим узлы и создаем карту
    return map;
  }, [threeNode]);

  return (
    <>
      {lines.map(([nodeAName, nodeBName], index) => {
        const nodeA = nodeMap[nodeAName];
        const nodeB = nodeMap[nodeBName];

        if (!nodeA || !nodeB) return null; // Пропускаем, если узел не найден

        return (
          <DimensionBetweenNodes
            key={index}
            nodeA={nodeA}
            nodeB={nodeB}
            label={`8ft / 2.4m`}
          />
        );
      })}
    </>
  );
};
