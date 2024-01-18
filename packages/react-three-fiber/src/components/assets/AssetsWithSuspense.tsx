import { type AssetProps, useAsset } from '../hooks/useAsset.js';

export const AssetWithSuspense = (props: AssetProps) => {
  const { assetId, configuration, ...r3fProps } = props;
  const threekitAsset = useAsset({ assetId, configuration });
  return (
    <>
      {threekitAsset ? (
        <primitive object={threekitAsset.scene} {...r3fProps} />
      ) : null}
    </>
  );
};
