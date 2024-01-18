import { animated, to, useSpring } from '@react-spring/three';
import type { ThreeEvent } from '@react-three/fiber';
import { useEffect } from 'react';
import { Vector3 } from 'three';

import { useCaseContext } from '../context/CaseContext.js';
import {
  type ThreeNodeProps,
  threeNodeRenderer
} from '../renderer/threeNodeRenderer.js';

export const Drawer: React.FC<ThreeNodeProps> = ({
  node,
  children
}: ThreeNodeProps) => {
  const drawerIndex =
    parseInt(node.name.replace('d', '').replace('_Null', '')) - 1;
  console.log('drawerIndex', drawerIndex);
  const caseContext = useCaseContext();

  const { position } = useSpring({
    position: caseContext.drawerOpen[drawerIndex] ? [0, 0, 20] : [0, 0, 0],
    config: { duration: 250 }
  });

  useEffect(() => {
    if (drawerIndex >= 6 && caseContext.drawerOpen[drawerIndex]) {
      caseContext.setBoiteBijouxOpen(false);
    }
  }, [caseContext.drawerOpen[drawerIndex]]);

  const onClick: (e: ThreeEvent<MouseEvent>) => void = (e) => {
    caseContext.setDrawerOpen(
      caseContext.drawerOpen.map((value, i) =>
        i === drawerIndex ? !value : value
      )
    );
    e.stopPropagation();
  };

  return (
    <animated.group position={to(position, (x, y, z) => new Vector3(x, y, z))}>
      {threeNodeRenderer({
        node,
        props: {
          onClick: onClick
        }
      })}
    </animated.group>
  );
};

export const DrawerMatcher = (
  node: THREE.Object3D
): React.FC<ThreeNodeProps> | undefined => {
  return node.name.match(/^d[0-9]+_Null$/) !== null ? Drawer : undefined;
};
