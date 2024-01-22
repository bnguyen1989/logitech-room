import s from './Player.module.scss';
import { OrbitControls } from '@react-three/drei';
import {
  AssetWithSuspense,
  ExporterResolver,
  OptimizeResolverWrapper,
  Viewer
} from '@threekit/react-three-fiber';
import type React from 'react';
import { Helmet as Head } from 'react-helmet';

import Geoff2Stage from '../stages/Geoff2Stage.tsx';

export const bhoustonAuth = {
  host: 'preview.threekit.com',
  orgId: '9eba6177-9cb1-4224-8e06-4f0d0f7cabbd',
  publicToken: 'bd3d25a8-51c9-4275-b69b-dae281c42442'
};

const assetId = '32ba8c20-d54a-46d2-a0bb-0339c71e7dc6'; // product

export const Player: React.FC = () => {
  return (
    <div className={s.container}>
      <Head>
        <title>{`Logitech`}</title>
      </Head>
      <Viewer
        auth={bhoustonAuth}
        resolver={OptimizeResolverWrapper(ExporterResolver({ cache: true }), {
          cacheScope: 'v1'
        })}
      >
        <>
          <Geoff2Stage>
            <AssetWithSuspense assetId={assetId} configuration={{}} />
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
