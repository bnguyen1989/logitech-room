import type { ThreeEvent } from '@react-three/fiber';
import { type AssetProps, useAsset } from '@threekit/react-three-fiber';

import { CaseProvider } from './context/CaseContext.js';
import { BoiteBijouxMatcher } from './models/BoiteBijoux.js';
import { DoorMatcher } from './models/Door.js';
import { DrawerMatcher } from './models/Drawer.js';
import { MirrorFrameMatcher } from './models/MirrorFrame.js';
import { TopDoorMatcher } from './models/TopDoor.js';
import { threeNodeRenderer } from './renderer/threeNodeRenderer.js';

export const Case: React.FC<AssetProps> = ({
  assetId,
  configuration
}: AssetProps) => {
  const gltf = useAsset({ assetId, configuration });

  return (
    <>
      <CaseProvider
        initialValues={{
          doorOpen: false,
          topDoorOpen: false,
          mirrorOpen: false,
          drawerOpen: [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ]
        }}
      >
        {threeNodeRenderer({
          nodeMatchers: [
            DrawerMatcher,
            MirrorFrameMatcher,
            DoorMatcher,
            TopDoorMatcher,
            BoiteBijouxMatcher
          ],
          node: gltf.scene,
          props: {
            onClick: (e: ThreeEvent<MouseEvent>) => {
              // do nothign but consume it.
              e.stopPropagation();
            }
          }
        })}
      </CaseProvider>
    </>
  );
};
