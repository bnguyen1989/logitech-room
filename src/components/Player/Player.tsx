import s from "./Player.module.scss";
import { CameraControls, OrbitControls } from "@react-three/drei";
import { ExporterResolver, Viewer } from "@threekit/react-three-fiber";
import CameraControlsImpl from "camera-controls";
import type React from "react";
import { Helmet as Head } from "react-helmet";
import Geoff2Stage from "../stages/Geoff2Stage.tsx";
import { Room } from "../Assets/Room.tsx";
import { ConfigData } from "../../utils/threekitUtils.ts";
import { useAppSelector } from "../../hooks/redux.ts";
import { getAssetId } from "../../store/slices/configurator/selectors/selectors.ts";
import { useRef } from "react"; 

export const bhoustonAuth = {
  host: ConfigData.host,
  orgId: ConfigData.orgId,
  publicToken: ConfigData.publicToken,
};

export const Player: React.FC = () => {
  const cameraControlsRef = useRef<CameraControlsImpl | null>(null);

  const assetId = useAppSelector(getAssetId);

  const focalLengthMm = 65; // Focal length in mm
  const sensorSizeMm = 36; // Horizontal sensor size of 35mm camera in mm

  const fovRad = 2 * Math.atan(sensorSizeMm / (2 * focalLengthMm));
  const fovDeg = fovRad * (180 / Math.PI); // Conversion of radians to degrees

  const canvasProps: any = {
    camera: {
      position: [155.8439, 79.0929, 106.9646],
      fov: fovDeg,
    },
  };

  // console.log("fovDeg", fovDeg);
  if (!assetId) return null;
  return (
    <div className={s.container}>
      <Head>
        <title>{`Logitech`}</title>
      </Head>
      <Viewer
        auth={bhoustonAuth}
        resolver={ExporterResolver({
          cache: true,
          cacheScope: "v12",
          mode: "experimental",
          settings: {
            prune: {
              childless: false,
              invisible: false,
            },
          },
        })}
        canvasProps={canvasProps}
        ui={false}
      >
        <>
          <CameraControls ref={cameraControlsRef} />
          <Geoff2Stage cameraControlsRef={cameraControlsRef}>
            <Room roomAssetId={assetId} />
          </Geoff2Stage>
          <OrbitControls
            enableDamping={true}
            enableZoom={false}
            maxDistance={3}
            minDistance={1}
            minZoom={1}
            maxZoom={3}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
     
          />
        </>
      </Viewer>
    </div>
  );
};
