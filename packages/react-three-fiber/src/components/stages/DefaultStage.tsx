import {
  Bounds,
  ContactShadows,
  Environment,
  SoftShadows,
  useBounds
} from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { type ReactNode } from 'react';
import React from 'react';
import { Color, MeshPhysicalMaterial } from 'three';

function Refit({
  radius,
  adjustCamera
}: {
  radius: number;
  adjustCamera: number | boolean;
}) {
  const api = useBounds();
  React.useEffect(() => {
    if (adjustCamera) api.refresh().clip().fit();
  }, [radius, adjustCamera]);
  return null;
}

export type DefaultStageProps = {
  children: ReactNode;
  toneMappingExposure?: number;
  childrenRotation?: number;
  softShadows?: {
    samples?: number;
    focus?: number;
    size?: number;
  };
  contactShadows?: {
    opacity?: number;
    blur?: number;
  };
  directLighting?: {
    shadowOpacity?: number;
    rotation?: number;
    offset?: number;
    intensity?: number;
  };
  environment?: {
    intensity?: number;
    path?: string;
    color?: string | Color;
  };
};

export const DefaultStage: React.FC<DefaultStageProps> = ({
  children,
  toneMappingExposure,
  childrenRotation = 0,
  softShadows = {},
  contactShadows = {},
  directLighting = {},
  environment = {}
}) => {
  const adjustCamera = 1.4;

  const { gl, scene } = useThree();

  if (toneMappingExposure != null) {
    gl.toneMappingExposure = toneMappingExposure;
  }

  if (environment?.intensity != null && environment?.path) {
    scene.traverseVisible((o) => {
      if (o.type === 'Mesh') {
        if ('material' in o && o.material instanceof MeshPhysicalMaterial) {
          o.material.envMapIntensity = environment.intensity ?? 2.1;
        }
      }
    });
  }

  const shadowBias = -0.002;
  return (
    <>
      {environment?.path && <Environment files={environment.path} blur={0} />}
      {(environment?.color || !environment?.path) && (
        <ambientLight
          color={environment.color || '#ffffff'}
          intensity={environment.intensity ?? 1}
        ></ambientLight>
      )}
      <SoftShadows
        size={softShadows.size ?? 140}
        focus={softShadows.focus ?? 0}
        samples={softShadows.samples ?? 30}
      />
      <group
        rotation={[0, (Math.PI / 180) * (directLighting.rotation ?? 0), 0]}
      >
        <directionalLight
          color={[1.0, 1.0, 1.0]}
          castShadow
          shadow-bias={shadowBias}
          position={[2 * 3, 2 * 3 + (directLighting.offset ?? 0), 2]}
          intensity={directLighting.intensity ?? 0.7}
          shadow-mapSize={1024}
          shadow-camera-near={0.1}
          shadow-camera-far={10}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-2.5, 2.5, -2.5, 2.5, 0.5, 50]}
          />
        </directionalLight>
      </group>
      <group>
        <Bounds
          fit={!!adjustCamera}
          clip={!!adjustCamera}
          margin={Number(adjustCamera)}
          damping={100}
          observe
        >
          <Refit radius={2} adjustCamera={adjustCamera} />
          <group rotation={[0, (Math.PI / 180) * childrenRotation, 0]}>
            {children}
          </group>
        </Bounds>
      </group>
      <ContactShadows
        resolution={1024}
        position={[0, 0, 0]}
        opacity={contactShadows.opacity ?? 0.7}
        scale={[5, 5]}
        blur={contactShadows.blur ?? 0.55}
        far={10}
      />
      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, 0.0, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10, 10, 10]} />
        <shadowMaterial opacity={directLighting.shadowOpacity ?? 0.15} />
      </mesh>
    </>
  );
};
