import { OrbitControls } from '@react-three/drei';
import {
  ExporterResolver,
  OptimizeResolverWrapper,
  Viewer
} from '@threekit/react-three-fiber';
import type React from 'react';
import { Helmet as Head } from 'react-helmet';

import Geoff2Stage from '../../../components/stages/Geoff2Stage.js';
import { Case } from './components/Case.js';

export const lvFosforAuth = {
  host: 'preview.threekit.com',
  orgId: '043fb51b-198a-4a9b-a177-0383799c6d6d',
  publicToken: '1844f8bb-16b6-490b-b0ec-5402cb0b4dad'
};

const assetId = 'e0444af9-3e3b-4fa6-901b-ac0dd8f1509c';
// product: '185999da-e2b9-44b4-8c3a-0355ac1246e9'; // product
// 3D Model: https://preview.threekit.com/o/lv-fosfor/branches/main/assets/d561a6eb-d062-4070-b05d-859e70d10ce4/edit
// Scene: https://preview.threekit.com/o/lv-fosfor/branches/main/assets/e0444af9-3e3b-4fa6-901b-ac0dd8f1509c/edit

export const MalleVendomeCaseViewer: React.FC = () => {
  return (
    <>
      <Head>
        <title>{`Malle Vendome`}</title>
      </Head>
      <Viewer
        auth={lvFosforAuth}
        resolver={OptimizeResolverWrapper(ExporterResolver({ cache: true }), {
          dedup: false,
          cacheScope: 'v1'
        })}
      >
        <>
          <Geoff2Stage>
            <Case assetId={assetId} configuration={{}} />
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
