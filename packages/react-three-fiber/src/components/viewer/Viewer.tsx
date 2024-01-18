import { Canvas } from '@react-three/fiber';
import type { ThreekitAuthProps } from '@threekit/rest-api';
import type React from 'react';
import { Suspense, useRef } from 'react';
import { styled } from 'styled-components';

import { ThreekitAuth } from '../hooks/useThreekitAuth.js';
import { ExporterResolver } from '../resolvers/ExporterResolver.js';
import type { GLTFUrlResolver } from '../resolvers/GLTFUrlResolver.js';
import { Resolver } from '../resolvers/Resolver.js';
import { FullscreenToggle } from './buttons/FullscreenButton.js';
import { ThreekitButton } from './buttons/ThreekitButton.js';
import { ViewerOverlay } from './ViewerOverlay.js';

type ViewerProps = {
  auth: ThreekitAuthProps;
  resolver?: GLTFUrlResolver;
  fgColor?: string;
  azimuth?: number;
  altitude?: number;
  zoom?: number;
  children?: React.ReactNode;
};

const Viewer2Div = styled.div`
  position: relative;
  text-align: center;
  overflow: hidden;
  margin: 0px;
  padding: 0px;
  height: 100vh;
  width: 100vw;
  pointer-events: none;
  touch-action: none;
  background-color: white;
`;

export const Viewer: React.FC<ViewerProps> = ({
  resolver = ExporterResolver({ cache: true }),
  fgColor,
  azimuth,
  altitude,
  zoom,
  auth,
  children
}) => {
  const fullscreenTargetDiv = useRef(null);
  return (
    <Viewer2Div ref={fullscreenTargetDiv}>
      <ThreekitAuth auth={auth}>
        <Suspense>
          <Canvas
            gl={{ antialias: true }}
            shadows
            camera={{ position: [0, 10, 10], fov: 35 }}
          >
            <Resolver resolver={resolver}>{children}</Resolver>
          </Canvas>
        </Suspense>
      </ThreekitAuth>
      <ViewerOverlay>
        <ThreekitButton fgColor={fgColor ?? '#000'} />
        <FullscreenToggle
          fgColor={fgColor ?? '#000'}
          targetDiv={fullscreenTargetDiv}
        />
      </ViewerOverlay>
    </Viewer2Div>
  );
};
