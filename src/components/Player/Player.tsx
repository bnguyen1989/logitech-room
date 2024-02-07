import s from "./Player.module.scss";
import { OrbitControls } from "@react-three/drei";
import {
  ExporterResolver,
  OptimizeResolverWrapper,
  Viewer,
} from "@threekit/react-three-fiber";
import type React from "react";
import { Helmet as Head } from "react-helmet";

import Geoff2Stage from "../stages/Geoff2Stage.tsx";
import { Room } from "../Assets/Room.tsx";
import { ConfigData } from "../../utils/threekitUtils.ts";
import { useAppSelector } from "../../hooks/redux.ts";
import {
  getAssetId,
  getConfiguration,
  getNodes,
} from "../../store/slices/configurator/selectors/selectors.ts";

export const bhoustonAuth = {
  host: ConfigData.host,
  orgId: ConfigData.orgId,
  publicToken: ConfigData.publicToken,
};

export const Player: React.FC = () => {
  const configuration = useAppSelector(getConfiguration);
  const nodes = useAppSelector(getNodes);
  const assetId = useAppSelector(getAssetId);

  if (!assetId) return null;

  return (
    <div className={s.container}>
      <Head>
        <title>{`Logitech`}</title>
      </Head>
      <Viewer
        auth={bhoustonAuth}
        resolver={OptimizeResolverWrapper(ExporterResolver({ cache: false }), {
          cacheScope: "v1",
        })}
      >
        <>
          <Geoff2Stage>
            <Room
              roomAssetId={assetId}
              attachNodeNameToAssetId={nodes}
              configuration={configuration}
            />
          </Geoff2Stage>
          <OrbitControls
            autoRotate={false}
            autoRotateSpeed={0.15}
            enableDamping={true}
            enableZoom={false}
            maxDistance={3}
            minDistance={1}
            panSpeed={0}
            minZoom={1}
            maxZoom={3}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            makeDefault
            enabled={true}
          />
        </>
      </Viewer>
    </div>
  );
};
