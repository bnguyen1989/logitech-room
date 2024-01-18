import { animated, useSpring } from '@react-spring/three';
import type { ThreeEvent } from '@react-three/fiber';
import { useEffect } from 'react';

import { useCaseContext } from '../context/CaseContext.js';
import {
  type ThreeNodeProps,
  threeNodeRenderer
} from '../renderer/threeNodeRenderer.js';
import { TopDoorHingeMatcher } from './TopDoorHinge.js';

export const TopDoor: React.FC<ThreeNodeProps> = ({ node }: ThreeNodeProps) => {
  const caseContext = useCaseContext();

  const halfPi = ((87 / 90) * Math.PI) / 2;
  const { rotation } = useSpring({
    rotation: caseContext.topDoorOpen ? 0 : halfPi,
    config: { duration: 250 }
  });

  useEffect(() => {
    if (!caseContext.topDoorOpen) {
      if (caseContext.doorOpen) {
        caseContext.setDoorOpen(false);
      }
      if (caseContext.mirrorOpen) {
        caseContext.setMirrorOpen(false);
      }
    }
  }, [caseContext.topDoorOpen]);

  const onClick: (e: ThreeEvent<MouseEvent>) => void = (e) => {
    caseContext.setTopDoorOpen(!caseContext.topDoorOpen);
    e.stopPropagation();
  };

  return (
    <animated.group position={node.position} rotation-x={rotation}>
      {node.children.map((child) =>
        threeNodeRenderer({
          nodeMatchers: [TopDoorHingeMatcher],
          node: child,
          props: {
            onClick: onClick
          }
        })
      )}
    </animated.group>
  );
};

export const TopDoorMatcher = (
  node: THREE.Object3D
): React.FC<ThreeNodeProps> | undefined => {
  return node.name.match(/^Top_Door_Null$/) !== null ? TopDoor : undefined;
};
