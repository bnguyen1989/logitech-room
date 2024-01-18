import { AssetJobs, Files } from '@threekit/rest-api';

import type { GLTFUrlResolverProps } from './GLTFUrlResolver.js';

export type ExporterResolverProps = {
  cache: boolean;
};
export const ExporterResolver = (props: ExporterResolverProps) => {
  return async ({
    auth,
    assetId,
    configuration
  }: GLTFUrlResolverProps): Promise<string> => {
    const res = await new AssetJobs(auth).export({
      assetId,
      configuration,
      format: 'glb',
      sync: true,
      cache: props.cache ?? true ? 'true' : 'false'
    });
    const assetJobResult = res.data;
    console.log(assetJobResult);
    const fileId = assetJobResult.job.runs[0].results.files[0].id; // TODO: This should be a helper
    return new Files(auth).getDownloadUrlById(fileId);
  };
};
