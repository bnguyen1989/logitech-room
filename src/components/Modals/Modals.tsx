import { AnnotationModal } from "./AnnotationModal/AnnotationModal";
import { SelectProductModal } from "./SelectProductModal/SelectProductModal";
import { SetupModal } from "./SetupModal/SetupModal";
import { ShareProjectModal } from "./ShareProjectModal/ShareProjectModal";

export const Modals: React.FC = () => {
  return (
    <>
      <SetupModal />
      <AnnotationModal />
      <SelectProductModal />
      <ShareProjectModal />
    </>
  );
};
