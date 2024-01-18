import { animated, config, to, useSpring } from '@react-spring/three';
import { useEffect, useState } from 'react';
import { AdditiveBlending, Mesh, MeshStandardMaterial, Vector3 } from 'three';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type AirConditionerPartProps = {
  name: string;
  node: Mesh;
  seeThru: boolean;
  error: boolean;
  selected: boolean;
  explodePosition: Vector3;
  explode: boolean;
  onClicked?: () => void;
};
export const AirConditionerPart: React.FC<AirConditionerPartProps> = ({
  name,
  node,
  seeThru,
  error,
  selected,
  explode,
  explodePosition,
  onClicked
}: AirConditionerPartProps) => {
  const [hover, setHover] = useState<number>(0);
  const [hoverEffect, setHoverEffect] = useState<number>(-1);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [material, setMaterial] = useState<MeshStandardMaterial>(
    node.material as MeshStandardMaterial
  );

  const [styles, api] = useSpring(
    () => ({
      position: [0, 0, 0]
    }),
    []
  );
  useEffect(() => {
    api.start({
      to: {
        position: explode ? explodePosition.toArray() : [0, 0, 0] // Convert Vector3 to array
      },
      config: explode ? config.wobbly : { duration: 500 }
    });
  }, [api, styles, explode, explodePosition]);

  if (isHover && hover === hoverEffect) {
    console.log('hovered', name);
  }
  useEffect(() => {
    // create copy of material with better red:
    let updatedMaterial = node.material as MeshStandardMaterial;
    if ((isHover && hover === hoverEffect) || error || seeThru || selected) {
      updatedMaterial = new MeshStandardMaterial();
      updatedMaterial.roughness = 0.75;
      updatedMaterial.metalness = 0;
      updatedMaterial.color.setHex(0x606060);
      if (isHover && hover === hoverEffect) {
        updatedMaterial.emissive.set(0x303088);
      }
      if (selected) {
        updatedMaterial.emissive.set(
          0x3030ff | updatedMaterial.emissive.getHex()
        );
      }
      if (error) {
        updatedMaterial.emissive.set(
          0xff0000 | updatedMaterial.emissive.getHex()
        );
      }
      if (
        !error &&
        !(isHover && hover === hoverEffect) &&
        !selected &&
        seeThru
      ) {
        updatedMaterial.transparent = true;
        updatedMaterial.depthWrite = false;
        updatedMaterial.blending = AdditiveBlending;
        updatedMaterial.opacity = 0.4;
      }
    }

    setMaterial(updatedMaterial);
  }, [node.material, isHover, hover, hoverEffect, seeThru, error, selected]);

  return (
    <animated.group
      onPointerOver={(e) => (
        e.stopPropagation(),
        setIsHover(true),
        setHover(hover + 1),
        sleep(100).then(() => {
          return setHoverEffect(hover + 1);
        })
      )}
      onPointerOut={() => (
        setIsHover(false), setHover(hover + 1), setHoverEffect(-1)
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClicked?.();
      }}
      position={to(styles.position, (x, y, z) => new Vector3(x, y, z))}
    >
      <mesh geometry={node.geometry} material={material}></mesh>
    </animated.group>
  );
};
