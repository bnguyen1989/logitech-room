import { Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import type React from "react";
import { type ReactNode, MutableRefObject } from "react";
import { ServerApi } from "../../services/api/Server/ServerApi";

const controls = {
  productRotation: 0,
  lighting: {
    keyRotation: 0,
    keyOffset: 0,
    keyIntensity: 0.7,
    fIblIntensity: 0.8,
    bIblIntensity: 2.1,
  },
  shadows: {
    keySamples: 90,
    keyFocus: 0,
    keySize: 40,
    keyOpacity: 0.15,
    cOpacity: 0.7,
    cBlur: 0.55,
  },
  fabric: {
    fRotation: 0.0,
  },
  bedding: {
    bEmissive: "#1c1c1c",
  },
  toneMapping: {
    exposure: 1.0,
  },
};

export type LogitechStageProps = {
  cameraControlsRef?: MutableRefObject<CameraControls | null>;
  altitude?: number;
  azimuth?: number;
  zoom?: number;
  children?: ReactNode;
};

const LogitechStage: React.FC<LogitechStageProps> = ({ children }) => {

  const { gl } = useThree();

  gl.toneMappingExposure = controls.toneMapping.exposure;

  return (
    <>
      <Environment
        files={`${ServerApi.getUrlApi()}/assets/ibl/env.hdr`}
        blur={0}
      />
      {/* <SoftShadows
        size={controls.shadows.keySize}
        focus={controls.shadows.keyFocus}
        samples={controls.shadows.keySamples}
      /> */}

      <group rotation={[0, (Math.PI / 180) * controls.productRotation, 0]}>
        {children}
      </group>
      {/* <ContactShadows
        resolution={1024}
        position={[0, -0.01, 0]}
        opacity={controls.shadows.cOpacity}
        scale={[5, 5]}
        blur={controls.shadows.cBlur}
        far={10}
      /> */}
      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, 0.0, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10, 10, 10]} />
        <shadowMaterial opacity={controls.shadows.keyOpacity} />
      </mesh>
    </>
  );
};

export default LogitechStage;
