import { useAsset } from "@threekit/react-three-fiber";
import { Cache } from "../../models/Cache";
import { useEffect } from "react";

interface CacheI {
  [key: string]: boolean;
}

const cache = new Cache<CacheI, boolean>();

type AssetDataI = {
  assetId: string;
  configuration?: any;
};
const AssetPreload: React.FC<AssetDataI> = ({
  assetId,
  configuration,
}) => {
  const gltf = useAsset({ assetId, configuration });

  useEffect(() => {
    if (!gltf) return;

    cache.set(assetId, true);
  }, [gltf]);

  return <></>;
};

interface PropsI {
  assets: AssetDataI[];
}
export const AssetsPreload: React.FC<PropsI> = ({ assets }) => {
  useEffect(() => {
    assets.forEach((asset) => {
      const isCached = cache.get(asset.assetId);
      if (isCached) return;
      cache.set(asset.assetId, false);
    });
  }, [assets]);

  return (
    <>
      {assets
        .filter((a) => !cache.get(a.assetId))
        .map((asset) => (
          <AssetPreload key={asset.assetId} {...asset} />
        ))}
    </>
  );
};
