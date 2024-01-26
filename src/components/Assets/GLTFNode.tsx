import type { ReactElement, ReactNode } from 'react';
import type { Mesh, Object3D } from 'three';

/* eslint-disable */

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

export const GLTFNode = ({
  nodeMatchers,
  threeNode,
  props
}: ThreeNodeRendererProps): ReactNode => {
  if (nodeMatchers) {
    for (let i = 0; i < nodeMatchers.length; i++) {
      const jsx = nodeMatchers[i](threeNode, nodeMatchers);
      if (jsx) {
        return jsx;
      }
    }
  }

  const children = threeNode.children.map((child: any) =>
    <GLTFNode threeNode={child} nodeMatchers={nodeMatchers} {...props} />
  );

  if ('isMesh' in threeNode) {
    const mesh = threeNode as Mesh;
    return (
      <mesh
        castShadow
        receiveShadow
        key={mesh.uuid + '-mesh'}
        geometry={mesh.geometry}
        material={mesh.material}
        position={threeNode.position}
        scale={threeNode.scale}
        rotation={threeNode.rotation}
        {...props}
      >
        {children}
      </mesh>
    );
  } else {
    return (
      <group
        key={threeNode.uuid + '-group'}
        position={threeNode.position}
        scale={threeNode.scale}
        rotation={threeNode.rotation}
        {...props}
      >
        {children}
      </group>
    );
  }
};
