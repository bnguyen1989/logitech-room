import { AnnotationModal } from "./AnnotationModal/AnnotationModal";
import { SelectProductModal } from './SelectProductModal/SelectProductModal'
import { SetupModal } from "./SetupModal/SetupModal";

export const Modals: React.FC = () => {
  return (
    <>
      <SetupModal />
      <AnnotationModal />
      <SelectProductModal />
    </>
  );
};
