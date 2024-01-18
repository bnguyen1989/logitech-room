import { type AssetProps, useAsset } from '@threekit/react-three-fiber';
import { Vector3 } from 'three';

import { AirConditionerPart } from './AirConditionerPart.js';

export type AirConditionerProps = AssetProps & {
  seeThru: boolean;
  explode: boolean;
  hideParts: string[];
  errorParts: string[];
  selectedPart: string;
  explodePositions: { [name: string]: Vector3 };
  onPartClicked?: (partName: string) => void;
};

export const AirConditioner: React.FC<AirConditionerProps> = ({
  assetId,
  configuration,
  seeThru,
  explode,
  hideParts,
  errorParts,
  selectedPart,
  explodePositions,
  onPartClicked
}: AirConditionerProps) => {
  const gltf = useAsset({ assetId, configuration });

  const nodes: THREE.Mesh[] = [];
  gltf.scene.traverse((node) => {
    if ('isMesh' in node) {
      nodes.push(node as THREE.Mesh);
    } else {
      //   console.log('non Mesh node.name', node.name);
    }
  });

  return (
    <>
      {nodes.map((node) => {
        let name = node.name;
        if (name.includes('mesh')) {
          name = node.parent?.name ?? '';
        }
        if (name === 'bottomStud') return;
        if (name === 'serviceHandleLeft') return;
        // console.log('node.name', name);
        if (hideParts.includes(name)) {
          // console.log('skipping rendering part ', name);
          return;
        }
        return (
          <AirConditionerPart
            key={node.uuid}
            name={name}
            node={node}
            explode={explode}
            explodePosition={explodePositions[name] ?? new Vector3()}
            seeThru={seeThru}
            error={errorParts.includes(name)}
            selected={selectedPart === name}
            onClicked={() => onPartClicked?.(name)}
          />
        );
      })}
    </>
  );
};
