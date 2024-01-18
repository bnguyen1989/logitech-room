import { animated, to, useSpring } from '@react-spring/three';
import type { ThreeEvent } from '@react-three/fiber';
import { useEffect } from 'react';
import { Vector3 } from 'three';

import { useCaseContext } from '../context/CaseContext.js';
import {
  type ThreeNodeProps,
  threeNodeRenderer
} from '../renderer/threeNodeRenderer.js';
import { BoiteBijouxDoorMatcher } from './BoiteBijouxDoor.js';

export const BoiteBijoux: React.FC<ThreeNodeProps> = ({
  node,
  children
}: ThreeNodeProps) => {
  const caseContext = useCaseContext();

  const { position } = useSpring({
    position: caseContext.boiteBijouxOut ? [0, 0, 40] : [0, 0, 0],
    config: { duration: 250 }
  });

  useEffect(() => {
    if (!caseContext.boiteBijouxOut) {
      caseContext.setBoiteBijouxOpen(false);
    }
  }, [caseContext.boiteBijouxOut]);

  const onClick: (e: ThreeEvent<MouseEvent>) => void = (e) => {
    caseContext.setBoiteBijouxOut(!caseContext.boiteBijouxOut);
    e.stopPropagation();
  };

  return (
    <animated.group position={to(position, (x, y, z) => new Vector3(x, y, z))}>
      {threeNodeRenderer({
        nodeMatchers: [BoiteBijouxDoorMatcher],
        node,
        props: {
          onClick: onClick
        }
      })}
    </animated.group>
  );
};

export const BoiteBijouxMatcher = (
  node: THREE.Object3D
): React.FC<ThreeNodeProps> | undefined => {
  return node.name.match(/^boiteBijoux_Null$/) !== null
    ? BoiteBijoux
    : undefined;
};
