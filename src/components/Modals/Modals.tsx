import { AnnotationModal } from "./AnnotationModal/AnnotationModal";
import { FinishModal } from "./FinishModal/FinishModal";
import { GuideModal } from './GuideModal/GuideModal'
import { RequestConsultationModal } from "./RequestConsultationModal/RequestConsultationModal";
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
      <FinishModal />
      <RequestConsultationModal />
      <GuideModal />
    </>
  );
};
