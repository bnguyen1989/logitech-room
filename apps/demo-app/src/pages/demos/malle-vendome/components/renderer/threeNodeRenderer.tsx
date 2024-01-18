import type { ReactNode } from 'react';
import type { Mesh, Object3D } from 'three';

export type ThreeNodeProps = {
  nodeMatchers?: NodeMatcher[];
  node: Object3D;
  props?: any;
  children: ReactNode;
};

export type NodeMatcher = (
  node: THREE.Object3D
) => React.FC<ThreeNodeProps> | undefined;

export type ThreeNodeRendererProps = {
  nodeMatchers?: NodeMatcher[];
  node: Object3D;
  props?: any;
};

export const threeNodeRenderer = ({
  nodeMatchers,
  node,
  props
}: ThreeNodeRendererProps): ReactNode => {
  if (nodeMatchers) {
    for (let i = 0; i < nodeMatchers.length; i++) {
      const CustomComponentClass = nodeMatchers[i](node);
      if (CustomComponentClass) {
        return (
          <CustomComponentClass
            nodeMatchers={nodeMatchers}
            node={node}
            {...props}
          />
        );
      }
    }
  }

  const children = node.children.map((child) =>
    threeNodeRenderer({ nodeMatchers, node: child, props })
  );

  if ('isMesh' in node) {
    const mesh = node as Mesh;
    return (
      <mesh
        castShadow
        receiveShadow
        key={mesh.uuid + '-mesh'}
        geometry={mesh.geometry}
        material={mesh.material}
        position={node.position}
        scale={node.scale}
        rotation={node.rotation}
        {...props}
      >
        {children}
      </mesh>
    );
  } else {
    return (
      <group
        key={node.uuid + '-group'}
        position={node.position}
        scale={node.scale}
        rotation={node.rotation}
        {...props}
      >
        {children}
      </group>
    );
  }
};
