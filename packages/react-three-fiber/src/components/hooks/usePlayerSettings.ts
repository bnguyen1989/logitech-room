import {
  Orgs,
  type PlayerSettings,
  type ThreekitAuthProps
} from '@threekit/rest-api';
import { useEffect, useState } from 'react';

export const usePlayerSettings = (auth: ThreekitAuthProps) => {
  const [playerSettings, setPlayerSettings] = useState<
    PlayerSettings | undefined
  >(undefined);
  return useEffect(() => {
    new Orgs(auth).getById().then((response) => {
      const org = response.data;
      setPlayerSettings(org.playerSettings);
      return org;
    });
  }, [auth]);

  return playerSettings;
};
