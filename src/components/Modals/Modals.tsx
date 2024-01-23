import { InfoModal } from "./InfoModal/InfoModal";
import { SetupModal } from "./SetupModal/SetupModal";

export const Modals: React.FC = () => {
  return (
    <>
      <SetupModal />
      <InfoModal />
    </>
  );
};
