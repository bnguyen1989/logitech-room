import { animated, useSpring } from '@react-spring/three';
import type { ThreeEvent } from '@react-three/fiber';
import { useEffect } from 'react';

import { useCaseContext } from '../context/CaseContext.js';
import {
  type ThreeNodeProps,
  threeNodeRenderer
} from '../renderer/threeNodeRenderer.js';

export const BoiteBijouxDoor: React.FC<ThreeNodeProps> = ({
  node,
  props
}: ThreeNodeProps) => {
  const caseContext = useCaseContext();

  const halfPi = ((75 / 90) * Math.PI) / 2;
  const { rotation } = useSpring({
    rotation: caseContext.boiteBijouxOpen ? -halfPi : 0,
    config: { duration: 250 }
  });

  useEffect(() => {
    if (caseContext.boiteBijouxOpen) {
      caseContext.setDrawerOpen(
        caseContext.drawerOpen.map((value, index) =>
          index >= 6 ? false : value
        )
      );
    }
  }, [caseContext.boiteBijouxOpen]);

  const onClick: (e: ThreeEvent<MouseEvent>) => void = (e) => {
    caseContext.setBoiteBijouxOpen(!caseContext.boiteBijouxOpen);
    e.stopPropagation();
  };

  return (
    <animated.group position={node.position} rotation-x={rotation}>
      {node.children.map((child) =>
        threeNodeRenderer({
          node: child,
          props: caseContext.boiteBijouxOut ? { onClick } : props
        })
      )}
    </animated.group>
  );
};

export const BoiteBijouxDoorMatcher = (
  node: THREE.Object3D
): React.FC<ThreeNodeProps> | undefined => {
  return node.name.match(/^boiteBijoux_Top_Door_Null$/) !== null
    ? BoiteBijouxDoor
    : undefined;
};
