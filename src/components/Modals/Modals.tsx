import { InfoModal } from "./InfoModal/InfoModal";
import { SelectProductModal } from './SelectProductModal/SelectProductModal'
import { SetupModal } from "./SetupModal/SetupModal";

export const Modals: React.FC = () => {
  return (
    <>
      <SetupModal />
      <InfoModal />
      <SelectProductModal />
    </>
  );
};
