import { animated, useSpring } from '@react-spring/three';
import { useEffect } from 'react';

import { useCaseContext } from '../context/CaseContext.js';
import {
  type ThreeNodeProps,
  threeNodeRenderer
} from '../renderer/threeNodeRenderer.js';

export const TopDoorHinge: React.FC<ThreeNodeProps> = ({
  node,
  props
}: ThreeNodeProps) => {
  const caseContext = useCaseContext();

  console.log('got to hinges!');
  const halfPi = Math.PI / 2;
  const { rotation } = useSpring({
    rotation: caseContext.topDoorOpen ? 0 : -halfPi,
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

  return (
    <animated.group position={node.position} rotation-x={rotation}>
      {node.children.map((child) =>
        threeNodeRenderer({
          node: child,
          props
        })
      )}
    </animated.group>
  );
};

export const TopDoorHingeMatcher = (
  node: THREE.Object3D
): React.FC<ThreeNodeProps> | undefined => {
  return node.name.match(/^Interior_Hinges_Null$/) !== null
    ? TopDoorHinge
    : undefined;
};
