// import Player from './components/Player.jsx';
import { ConfiguratorProvider, useConfigurator } from '@threekit/configurator';
import {
  Asset,
  DefaultStage,
  ExporterResolver,
  OptimizeResolverWrapper,
  Viewer
} from '@threekit/react-three-fiber';
import {
  TurntableControls,
  TurntableControlsImpl
} from '@threekit/react-three-fiber';
import { useState } from 'react';

import ProductForm from './ProductForm.js';

export const carAuth = {
  host: 'preview.threekit.com',
  orgId: '4cd37598-6cac-4a2d-9b6d-ccd2336cd6f8',
  publicToken: 'a2747991-b640-490b-b76e-59788895f5ab'
};

const assetId = '71e76734-3587-49ca-a6ca-47ce54f9e6c8';

function App() {
  const configurator = useConfigurator(assetId, 'product');

  const [_controls, setControls] = useState<TurntableControlsImpl | null>();

  return (
    <div
      style={{
        width: '100vw',
        display: 'grid',
        gridTemplateColumns: '50% 50%',
        gridGap: '20px'
      }}
    >
      {/* <Player config={props.config} style={props.style} /> */}
      <div>
        <Viewer
          auth={carAuth}
          resolver={OptimizeResolverWrapper(ExporterResolver({ cache: true }), {
            cacheScope: 'v1'
          })}
        >
          <DefaultStage environment={{ path: '/ibl/Sample_ibl_studio_1k.hdr' }}>
            <TurntableControls ref={setControls} maxPolarAngle={Math.PI / 2}>
              <Asset
                assetId={assetId}
                configuration={configurator?.configuration ?? {}}
                rotation={[0, Math.PI, 0]}
              />
            </TurntableControls>
            <mesh position={[0, -0.01, 0]} scale={[10, 0.01, 10]}>
              <boxGeometry />
              <meshPhysicalMaterial />
            </mesh>
          </DefaultStage>
        </Viewer>
      </div>
      <ProductForm assetId={assetId} assetKey="product" />
    </div>
  );
}

export const CarConfiguratorDemo = () => {
  return (
    <ConfiguratorProvider auth={carAuth}>
      <App />
    </ConfiguratorProvider>
  );
};
