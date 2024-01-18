import { OrbitControls } from '@react-three/drei';
import {
  ExporterResolver,
  OptimizeResolverWrapper,
  Viewer
} from '@threekit/react-three-fiber';
import Papa from 'papaparse';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Helmet as Head } from 'react-helmet';
import { Vector3 } from 'three';

import Geoff2Stage from '../../../components/stages/Geoff2Stage.js';
import { AirConditioner } from './AirConditioner.js';

export const sfmfAuth = {
  host: 'preview.threekit.com',
  publicToken: 'ac3d28a8-6562-435a-87d6-d3bcee739df1',
  orgId: '8642e408-5c80-4c36-92a2-71c8e0abef40'
};

const assetId = '8e821e86-e983-4ca9-b97d-baa4058c05ea';

type Part = {
  '3D Model Node Name': string;
  SKU: string;
  'Product ID': string;
  'Part Name': string;
  Code: string;
  'Asset ID': string;
  'Explode Position': string;
};

type PartList = Part[];

const partList: PartList = [];
const explodePositions: { [name: string]: Vector3 } = {};
fetch('./partList.csv')
  .then((response) => {
    //   console.log('response', response);
    return response.text();
  })
  .then((text) => {
    return Papa.parse(text, {
      header: true,
      complete: function (results: { data: PartList }) {
        console.log('Finished:', results.data);
        partList.push(...(results.data as PartList));

        partList.forEach((part) => {
          const positionText = part['Explode Position']
            .replace('x', '"x"')
            .replace('y', '"y"')
            .replace('z', '"z"');

          if (positionText === '') return;
          const position = JSON.parse(positionText);
          explodePositions[part['3D Model Node Name']] = new Vector3(
            position.x,
            position.y,
            position.z
          );
        });

        return explodePositions;
      }
    });
  });

export const AirConditionerDemo: React.FC = () => {
  const [seeThru, setSeeThru] = useState(false);
  const [explode, setExplode] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [errorParts, setErrorParts] = useState<string[]>([]);
  const [hideParts, setHideParts] = useState<string[]>([]);

  // Key handler function
  const handleKeyPress = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'q':
        setExplode((explode) => !explode); // Toggle see-thru on 'S' key press
        break;
      case 's':
        setSeeThru((prevSeeThru) => !prevSeeThru); // Toggle see-thru on 'S' key press
        break;
      case 'e':
        setErrorParts((prevErrorParts) => [...prevErrorParts, 'frontPanel']);
        break;
      case 'h':
        setHideParts((prevHideParts) => [...prevHideParts, 'topCover']);
        break;
      case 'r':
        setErrorParts((prevErrorParts) =>
          prevErrorParts.filter((part) => part !== 'frontPanel')
        );
        break;
      case 'u':
        setHideParts((prevHideParts) =>
          prevHideParts.filter((part) => part !== 'topCover')
        );
        break;
    }
  };

  useEffect(() => {
    // Attach event listener
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup event listener
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []); // Empty dependency array ensures this runs once on mount and unmount

  return (
    <>
      <Head>
        <title>{`Air Conditioner Viewer`}</title>
      </Head>
      <Viewer
        auth={sfmfAuth}
        resolver={OptimizeResolverWrapper(ExporterResolver({ cache: true }), {
          cacheScope: 'v2'
        })}
      >
        <>
          <Geoff2Stage>
            <AirConditioner
              assetId={assetId}
              explode={explode}
              explodePositions={explodePositions}
              seeThru={seeThru}
              selectedPart={selectedPart}
              errorParts={errorParts}
              hideParts={hideParts}
              onPartClicked={undefined}
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
    </>
  );
};
