import type { Configuration, ThreekitAuthProps } from '@threekit/rest-api';

export type GLTFUrlResolverProps = {
  assetId: string;
  configuration?: Configuration;
  auth: ThreekitAuthProps;
};

export type GLTFUrlResolver = (props: GLTFUrlResolverProps) => Promise<string>;
