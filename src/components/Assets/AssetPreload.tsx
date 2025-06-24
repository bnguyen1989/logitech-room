import { useAsset } from "@threekit/react-three-fiber";

type AssetDataI = {
  assetId: string;
  configuration?: any;
};
const AssetPreload: React.FC<AssetDataI> = ({ assetId, configuration }) => {
  useAsset({ assetId, configuration });
  return <></>;
};

interface PropsI {
  assets: AssetDataI[];
}
export const AssetsPreload: React.FC<PropsI> = ({ assets }) =>
  assets.map((asset) => <AssetPreload key={asset.assetId} {...asset} />);
