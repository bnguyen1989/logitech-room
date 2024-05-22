import s from "./Player.module.scss";
import { OrbitControls } from "@react-three/drei";
import { ExporterResolver, Viewer } from "@threekit/react-three-fiber";
import type React from "react";
import { Helmet as Head } from "react-helmet";
import LogitechStage from "../stages/LogitechStage.tsx";
import { Room } from "../Assets/Room.tsx";
import { ConfigData } from "../../utils/threekitUtils.ts";
import { useAppSelector } from "../../hooks/redux.ts";
import { getAssetId } from "../../store/slices/configurator/selectors/selectors.ts";
import { Camera, PerspectiveCamera, Vector3 } from "three";
import {
  EffectComposer,
  Selection,
  Outline,
  ToneMapping,
} from "@react-three/postprocessing";
import { useCache } from "../../hooks/cache.ts";
import { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { snapshot } from "../../utils/snapshot.ts";
import { EffectComposer as EffectComposerImpl, ToneMappingMode } from "postprocessing";
import { usePlayer } from "../../hooks/player.ts";
import { base64ToBlob } from "../../utils/browserUtils.ts";

export const bhoustonAuth = {
  host: ConfigData.host,
  orgId: ConfigData.orgId,
  publicToken: ConfigData.publicToken,
};

export const Player: React.FC = () => {
  const { cache, keyCache } = useCache();
  const { distance } = usePlayer();

  const assetId = useAppSelector(getAssetId);

  const [effectComposerRef, setEffectComposerRef] =
    useState<EffectComposerImpl | null>(null);
  const [snapshotCamera, setSnapshotCamera] = useState<Camera>();

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

  useEffect(() => {
    if (!effectComposerRef || snapshotCamera) return;
    const oldCamera = (
      effectComposerRef.passes.find((pass) => !!(pass as any).camera) as any
    )?.camera as Camera | undefined;
    if (oldCamera) {
      const camera = new PerspectiveCamera();
      camera.copy(oldCamera as PerspectiveCamera);
      setSnapshotCamera(camera);
    }
  }, [effectComposerRef]);

  (window as any).snapshot = (type: "string" | "blob"): string | Blob => {
    if (!effectComposerRef) return "";
    const dataSnapshot = snapshot(effectComposerRef, {
      size: { width: 1920, height: 1080 },
      camera: snapshotCamera,
    });
    if (type === "string") {
      return dataSnapshot;
    }
    return base64ToBlob(dataSnapshot);
  };

  if (!assetId) return null;
  return (
    <div className={s.container}>
      <Head>
        <title>{`Logitech`}</title>
      </Head>
      <Viewer
        auth={bhoustonAuth}
        resolver={ExporterResolver({
          cache: cache,
          cacheScope: keyCache,
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
          <Selection>
            <Effects ref={setEffectComposerRef} />
            <LogitechStage>
              <Room roomAssetId={assetId} />
            </LogitechStage>
            <OrbitControls
              enableDamping={true}
              enableZoom={true}
              minDistance={distance.minDistance}
              maxDistance={distance.maxDistance}
              target={
                new Vector3(
                  -3.3342790694469784,
                  15.269443817758102,
                  -3.999528610518013
                )
              }
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2}
            />
          </Selection>
        </>
      </Viewer>
    </div>
  );
};

const Effects = forwardRef((_props, ref: ForwardedRef<EffectComposerImpl>) => {
  return (
    <EffectComposer
      stencilBuffer
      disableNormalPass
      autoClear={false}
      multisampling={4}
      ref={ref}
    >
      <Outline
        visibleEdgeColor={0x47b63f}
        hiddenEdgeColor={0x47b63f}
        blur={false}
        edgeStrength={10}
      />
      <ToneMapping mode={ToneMappingMode.UNCHARTED2}/>
    </EffectComposer>
  );
});
