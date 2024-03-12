import {
  ExporterResolver,
  OptimizeResolverWrapper,
  Resolver
} from '@threekit/react-three-fiber';

export type ProductResolverProps = {
  children: React.ReactNode;
};

export const ProductResolver: React.FC<ProductResolverProps> = ({
  children
}) => {
  return (
    <Resolver
      resolver={OptimizeResolverWrapper(
        ExporterResolver({
          cache: true,
          cacheScope: 'v6'
        }),
        {
          dedup: true,
          textureSize: 256,
          cacheScope: 'v6'
        }
      )}
    >
      {children}
    </Resolver>
  );
};
