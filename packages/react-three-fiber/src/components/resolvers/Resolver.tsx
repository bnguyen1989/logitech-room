import type React from 'react';
import { createContext, useContext } from 'react';

import type { GLTFUrlResolver } from './GLTFUrlResolver.js';

export const ThreekitResolverContext = createContext<
  GLTFUrlResolver | undefined
>(undefined);

export const useResolver = () => {
  const resolver = useContext<GLTFUrlResolver | undefined>(
    ThreekitResolverContext
  );

  if (!resolver)
    throw new Error(
      'useThreekitResolver must be accessed within the scope of ThreekitResolver'
    );

  return resolver;
};

export type ResolverProps = {
  resolver: GLTFUrlResolver;
  children?: React.ReactNode;
};

export const Resolver: React.FC<ResolverProps> = ({ resolver, children }) => {
  return (
    <>
      <ThreekitResolverContext.Provider value={resolver}>
        {children}
      </ThreekitResolverContext.Provider>
    </>
  );
};
