import { OrbitControls } from '@react-three/drei';
import {
  AssetWithSuspense,
  ExporterResolver,
  OptimizeResolverWrapper,
  Viewer
} from '@threekit/react-three-fiber';
import type React from 'react';
import { Helmet as Head } from 'react-helmet';

import Geoff2Stage from '../../../components/stages/Geoff2Stage.js';

export const bhoustonAuth = {
  host: 'preview.threekit.com',
  orgId: 'f40d1e39-d267-49af-af14-fa7bf4b9c904',
  publicToken: 'ea6a7e81-1093-4751-89ef-e0b34164dd97'
};

const assetId = 'e4c8d2b0-6ac3-4299-89d6-63c094a28aa8'; // product

export const EamesChairDemo: React.FC = () => {
  return (
    <>
      <Head>
        <title>{`Eames Chair Viewer`}</title>
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
    </>
  );
};
