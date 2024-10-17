import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/redux";
import { getIsProcessing } from "../../store/slices/configurator/selectors/selectors";
import s from "./PlayerWidgets.module.scss";
import { IconButton } from "../Buttons/IconButton/IconButton";
import { InfoSVG } from "../../assets";
import { setGuideModal } from "../../store/slices/modals/Modals.slice";

export const PlayerWidgets: React.FC = () => {
  const dispatch = useDispatch();
  const isProcessing = useAppSelector(getIsProcessing);

  const handleInfo = () => {
    dispatch(setGuideModal({ isOpen: true }));
  };

  if (isProcessing) return null;

  return (
    <div className={s.container}>
      <IconButton onClick={handleInfo}>
        <InfoSVG />
      </IconButton>
    </div>
  );
};
