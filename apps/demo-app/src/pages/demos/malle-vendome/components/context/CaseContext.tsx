import React, { createContext, type ReactNode, useState } from 'react';

interface CaseContextProps {
  doorOpen: boolean;
  topDoorOpen: boolean;
  mirrorOpen: boolean;
  drawerOpen: boolean[];
  boiteBijouxOut: boolean;
  boiteBijouxOpen: boolean;
  setDoorOpen: (isOpen: boolean) => void;
  setTopDoorOpen: (isOpen: boolean) => void;
  setMirrorOpen: (isOpen: boolean) => void;
  setDrawerOpen: (isOpen: boolean[]) => void;
  setBoiteBijouxOut: (isOpen: boolean) => void;
  setBoiteBijouxOpen: (isOpen: boolean) => void;
}

export const CaseContext = createContext<CaseContextProps | undefined>(
  undefined
);

export const CaseProvider: React.FC<{
  initialValues?: Partial<CaseContextProps>;
  children?: ReactNode;
}> = ({ initialValues, children }) => {
  const [doorOpen, setDoorOpen] = useState<boolean>(
    initialValues?.doorOpen ?? false
  );
  const [topDoorOpen, setTopDoorOpen] = useState<boolean>(
    initialValues?.topDoorOpen ?? false
  );
  const [mirrorOpen, setMirrorOpen] = useState<boolean>(
    initialValues?.mirrorOpen ?? false
  );
  const [drawerOpen, setDrawerOpen] = useState<boolean[]>(
    initialValues?.drawerOpen ?? [false]
  );
  const [boiteBijouxOut, setBoiteBijouxOut] = useState<boolean>(
    initialValues?.boiteBijouxOut ?? false
  );
  const [boiteBijouxOpen, setBoiteBijouxOpen] = useState<boolean>(
    initialValues?.boiteBijouxOpen ?? false
  );
  return (
    <CaseContext.Provider
      value={{
        doorOpen,
        topDoorOpen,
        mirrorOpen,
        drawerOpen,
        boiteBijouxOut,
        boiteBijouxOpen,
        setDoorOpen,
        setTopDoorOpen,
        setMirrorOpen,
        setDrawerOpen,
        setBoiteBijouxOut,
        setBoiteBijouxOpen
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCaseContext = (): CaseContextProps => {
  const context = React.useContext(CaseContext);
  if (context === undefined) {
    throw new Error('useCaseContext must be used within a CaseProvider');
  }
  return context;
};
