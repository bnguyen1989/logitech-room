import s from "./Player.module.scss";
import { OrbitControls } from "@react-three/drei";
import {
  Background,
  ExporterResolver,
  Viewer,
} from "@threekit/react-three-fiber";
import type React from "react";
import { Helmet as Head } from "react-helmet";
import LogitechStage from "../stages/LogitechStage.tsx";
import { Room } from "../Assets/Room.tsx";
import { ConfigData, getPreloadAssets } from "../../utils/threekitUtils.ts";
import { useAppSelector } from "../../hooks/redux.ts";
import { getAssetId } from "../../store/slices/configurator/selectors/selectors.ts";
import { Camera } from "three";
import {
  EffectComposer,
  Selection,
  Outline,
  ToneMapping,
} from "@react-three/postprocessing";
import { useCache } from "../../hooks/cache.ts";
import { ForwardedRef, forwardRef, useState } from "react";
import { snapshot } from "../../utils/snapshot.ts";
import {
  BlendFunction,
  EffectComposer as EffectComposerImpl,
  EffectPass,
  RenderPass,
  ToneMappingEffect,
  ToneMappingMode,
} from "postprocessing";
import { usePlayer } from "../../hooks/player.ts";
import { base64ToBlob } from "../../utils/browserUtils.ts";
import { AssetsPreload } from "../Assets/AssetPreload.tsx";

export const bhoustonAuth = {
  host: ConfigData.host,
  orgId: ConfigData.orgId,
  publicToken: ConfigData.publicToken,
};

export const Player: React.FC = () => {
  const { cache, keyCache } = useCache();
  const { target, distance, polarAngle, azimuthalAngle } = usePlayer();

  const assetId = useAppSelector(getAssetId);

  const [effectComposerRef, setEffectComposerRef] =
    useState<EffectComposerImpl | null>(null);
  const [snapshotCameras, setSnapshotCameras] =
    useState<Record<string, Camera>>();

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

  console.log("distance = ", { distance, target });

  (window as any).snapshot = (
    type: "string" | "blob",
    side: "Front" | "Left" = "Front"
  ): string | Blob => {
    if (!effectComposerRef) return "";
    const snapshotCamera = snapshotCameras?.[side];

    const snapshotEC = new EffectComposerImpl(effectComposerRef.getRenderer(), {
      stencilBuffer: true,
      multisampling: effectComposerRef.multisampling,
      frameBufferType: effectComposerRef.inputBuffer.texture.type,
    });
    snapshotEC.addPass(
      new RenderPass((effectComposerRef.passes[0] as any).scene, snapshotCamera)
    );
    snapshotEC.addPass(
      new EffectPass(
        snapshotCamera,
        new ToneMappingEffect({
          mode: ToneMappingMode.UNCHARTED2,
          whitePoint: 1,
          middleGrey: 0.5,
          minLuminance: 0.01,
          maxLuminance: 1,
          averageLuminance: 0.5,
        })
      )
    );

    const dataSnapshot = snapshot(snapshotEC, {
      size: { width: 1024, height: 512 },
      camera: snapshotCamera,
    });

    snapshotEC.dispose();

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
              <Room
                roomAssetId={assetId}
                setSnapshotCameras={setSnapshotCameras}
              />
            </LogitechStage>
            <AssetsPreload assets={getPreloadAssets()} />
            <OrbitControls
              enableDamping={true}
              enableZoom={true}
              minDistance={distance.minDistance}
              maxDistance={distance.maxDistance}
              target={target}
              minPolarAngle={polarAngle.minPolarAngle}
              maxPolarAngle={polarAngle.maxPolarAngle}
              minAzimuthAngle={azimuthalAngle.maxAzimuthalAngle}
              maxAzimuthAngle={azimuthalAngle.maxAzimuthalAngle}
            />
          </Selection>
        </>
      </Viewer>
    </div>
  );
};

const Effects = forwardRef((_props, ref: ForwardedRef<EffectComposerImpl>) => {
  return (
    <EffectComposer stencilBuffer autoClear={false} multisampling={4} ref={ref}>
      <Outline
        visibleEdgeColor={0x32156d}
        hiddenEdgeColor={0x32156d}
        blur={true}
        edgeStrength={30}
        pulseSpeed={0.3}
        resolutionScale={0.5}
        blendFunction={BlendFunction.SCREEN}
      />
      <ToneMapping
        mode={ToneMappingMode.UNCHARTED2}
        whitePoint={1}
        middleGrey={0.5}
        minLuminance={0.01}
        maxLuminance={1}
        averageLuminance={0.5}
      />
      <Background color={"#f4f4f4"} />
    </EffectComposer>
  );
});
