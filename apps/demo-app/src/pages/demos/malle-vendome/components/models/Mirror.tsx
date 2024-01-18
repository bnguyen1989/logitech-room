import { animated, to, useSpring } from '@react-spring/three';
import { MeshReflectorMaterial } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { useState } from 'react';
import { type Mesh, Vector3 } from 'three';

import type { ThreeNodeProps } from '../renderer/threeNodeRenderer.js';

export const Mirror: React.FC<ThreeNodeProps> = ({
  node,
  props,
  children
}: ThreeNodeProps) => {
  const [open, setOpen] = useState(false);

  const { position } = useSpring({
    position: open ? [0, 40, 0] : [0, 0, 0],
    config: { duration: 250 }
  });

  const onClick: (e: ThreeEvent<MouseEvent>) => void = (e) => {
    setOpen(!open);
    e.stopPropagation();
  };

  const mesh = node as Mesh;

  return (
    <animated.group
      key={mesh.uuid}
      position={to(position, (x, y, z) => new Vector3(x, y, z))}
    >
      <mesh
        castShadow
        receiveShadow
        key={mesh.uuid + '-mesh'}
        geometry={mesh.geometry}
        position={node.position}
        scale={node.scale}
        rotation={node.rotation}
        {...props}
      >
        <MeshReflectorMaterial
          resolution={2048}
          reflectorOffset={-0.125}
          roughness={0}
          color="#ffffff"
          metalness={1.0}
          mirror={1}
        />
        {children}
      </mesh>
    </animated.group>
  );
};

export const MirrorMatcher = (
  node: THREE.Object3D
): React.FC<ThreeNodeProps> | undefined => {
  return node.name.match(/^mirror_2_GEO$/) !== null ? Mirror : undefined;
};
