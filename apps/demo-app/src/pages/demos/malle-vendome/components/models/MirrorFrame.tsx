import { animated, to, useSpring } from '@react-spring/three';
import type { ThreeEvent } from '@react-three/fiber';
import { Vector3 } from 'three';

import { useCaseContext } from '../context/CaseContext.js';
import {
  type ThreeNodeProps,
  threeNodeRenderer
} from '../renderer/threeNodeRenderer.js';
import { MirrorMatcher } from './Mirror.js';

export const MirrorFrame: React.FC<ThreeNodeProps> = ({
  nodeMatchers: nodeFilter,
  node,
  children
}: ThreeNodeProps) => {
  const caseContext = useCaseContext();

  const { position } = useSpring({
    position: caseContext.mirrorOpen ? [0, 18, 0] : [0, 0, 0],
    config: { duration: 250 }
  });

  const onClick: (e: ThreeEvent<MouseEvent>) => void = (e) => {
    caseContext.setMirrorOpen(!caseContext.mirrorOpen);
    e.stopPropagation();
  };

  return (
    <animated.group
      key={node.uuid}
      position={to(position, (x, y, z) => new Vector3(x, y, z))}
    >
      {threeNodeRenderer({
        nodeMatchers: [MirrorMatcher],
        node,
        props: {
          onClick: onClick
        }
      })}
    </animated.group>
  );
};

export const MirrorFrameMatcher = (
  node: THREE.Object3D
): React.FC<ThreeNodeProps> | undefined => {
  return node.name.match(/^Mirror_Null$/) !== null ? MirrorFrame : undefined;
};
