import { animated, useSpring } from '@react-spring/three';
import type { ThreeEvent } from '@react-three/fiber';
import { useEffect } from 'react';

import { useCaseContext } from '../context/CaseContext.js';
import {
  type ThreeNodeProps,
  threeNodeRenderer
} from '../renderer/threeNodeRenderer.js';

export const Door: React.FC<ThreeNodeProps> = ({ node }: ThreeNodeProps) => {
  const caseContext = useCaseContext();

  console.log('door', node.name);

  const halfPi = Math.PI / 2;
  const { rotation } = useSpring({
    rotation: caseContext.doorOpen ? halfPi : 0,
    config: { duration: 250 }
  });

  useEffect(() => {
    if (caseContext.doorOpen) {
      if (!caseContext.topDoorOpen) {
        caseContext.setTopDoorOpen(true);
      }
    }
    if (!caseContext.doorOpen) {
      caseContext.setDrawerOpen(
        caseContext.drawerOpen.map((value, i) => false)
      );
      caseContext.setBoiteBijouxOut(false);
    }
  }, [caseContext.doorOpen]);

  const onClick: (e: ThreeEvent<MouseEvent>) => void = (e) => {
    caseContext.setDoorOpen(!caseContext.doorOpen);
    e.stopPropagation();
  };

  return (
    <animated.group position={node.position} rotation-y={rotation}>
      {node.children.map((child) =>
        threeNodeRenderer({
          node: child,
          props: {
            onClick: onClick
          }
        })
      )}
    </animated.group>
  );
};

export const DoorMatcher = (
  node: THREE.Object3D
): React.FC<ThreeNodeProps> | undefined => {
  return node.name.match(/^Door_Null$/) !== null ? Door : undefined;
};
