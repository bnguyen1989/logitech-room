import type { ReactElement, ReactNode } from "react";
import * as THREE from "three";
import type { Mesh, Object3D } from "three";
import { PlacementManager } from "../../models/configurator/PlacementManager";

export type ThreeNodeProps = {
  nodeMatchers?: NodeMatcher[];
  threeNode: Object3D;
  children?: ReactNode;
  props?: object;
};

export type NodeMatcher = (
  threeNode: THREE.Object3D,
  nodeMatchers?: NodeMatcher[]
) => ReactElement | undefined;

export type ThreeNodeRendererProps = {
  threeNode: Object3D;
  nodeMatchers?: NodeMatcher[];
  props?: object;
};

const getParentNames = (object: THREE.Object3D): string[] => {
  const parentNames: string[] = [];
  let currentObject: THREE.Object3D | null = object;

  while (currentObject.parent) {
    if (currentObject.parent.name) {
      parentNames.push(currentObject.parent.name);
    }
    currentObject = currentObject.parent;
  }

  return parentNames;
};

export const GLTFNode = ({
  nodeMatchers,
  threeNode,
  props,
}: ThreeNodeRendererProps): ReactNode => {
  if (nodeMatchers) {
    for (let i = 0; i < nodeMatchers.length; i++) {
      const jsx = nodeMatchers[i](threeNode, nodeMatchers);
      if (jsx) {
        return jsx;
      }
    }
  }

  const children = threeNode.children.map((child) => (
    <GLTFNode
      key={child.uuid}
      threeNode={child}
      nodeMatchers={nodeMatchers}
      {...props}
    />
  ));

  if ("isMesh" in threeNode) {
    const mesh = threeNode as Mesh;
    console.log(
      "🔍 [GLTFNode] Mesh visible:",
      threeNode.name,
      threeNode.visible
    );
    return (
      <mesh
        castShadow
        receiveShadow
        key={mesh.uuid + "-mesh"}
        geometry={mesh.geometry}
        material={mesh.material}
        position={threeNode.position}
        scale={threeNode.scale}
        rotation={threeNode.rotation}
        visible={threeNode.visible}
        {...props}
        onPointerMove={(e) => {
          const intersections = e.intersections;

          const parentNames = getParentNames(intersections[0].object)
            .flat()
            .filter(
              (name, index, self) => name !== "" && self.indexOf(name) === index
            )
            .filter(
              (name) => !name.includes(PlacementManager.getNameNodeForTV())
            );

          document.body.style.cursor =
            parentNames.length > 0 ? "pointer" : "default";
        }}
      >
        {children}
      </mesh>
    );
  } else {
    console.log(
      "🔍 [GLTFNode] Group/Object3D visible:",
      threeNode.name,
      threeNode.visible
    );
    return (
      <group
        key={threeNode.uuid + "-group"}
        position={threeNode.position}
        scale={threeNode.scale}
        rotation={threeNode.rotation}
        visible={threeNode.visible}
        {...props}
      >
        {children}
      </group>
    );
  }
};
