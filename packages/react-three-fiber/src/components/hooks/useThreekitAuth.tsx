import type { ThreekitAuthProps } from '@threekit/rest-api';
import type React from 'react';
import { createContext, useContext } from 'react';

export const ThreekitAuthContext = createContext<ThreekitAuthProps | undefined>(
  undefined
);

export const useThreekitAuth = () => {
  const threekitAuthContext = useContext<ThreekitAuthProps | undefined>(
    ThreekitAuthContext
  );

  if (!threekitAuthContext)
    throw new Error(
      'useThreekitAuth must be accessed within the scope of ThreekitAuth'
    );

  return threekitAuthContext;
};
export const ThreekitAuth: React.FC<{
  auth: ThreekitAuthProps;
  children?: React.ReactNode;
}> = ({ auth, children }) => {
  return (
    <>
      <ThreekitAuthContext.Provider value={auth}>
        {children}
      </ThreekitAuthContext.Provider>
    </>
  );
};
