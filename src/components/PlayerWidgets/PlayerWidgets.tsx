import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/redux";
import {
  getDimensionEnabled,
  getIsProcessing,
} from "../../store/slices/configurator/selectors/selectors";
import s from "./PlayerWidgets.module.scss";
import { IconButton } from "../Buttons/IconButton/IconButton";
import { DimensionSVG, InfoSVG, ProductInfoSVG } from "../../assets";
import { setGuideModal } from "../../store/slices/modals/Modals.slice";
import { setHighlightAllProducts } from "../../store/slices/ui/actions/actions";
import { setEnabledDimension } from "../../store/slices/configurator/Configurator.slice";

export const PlayerWidgets: React.FC = () => {
  const dispatch = useDispatch();
  const isProcessing = useAppSelector(getIsProcessing);
  const enabledDimension = useAppSelector(getDimensionEnabled);

  const handleInfo = () => {
    dispatch(setGuideModal({ isOpen: true }));
  };

  const handleHighlightProducts = () => {
    dispatch(setHighlightAllProducts({ isHighlight: true }));

    setTimeout(() => {
      dispatch(setHighlightAllProducts({ isHighlight: false }));
    }, 5000);
  };

  const handleDimension = () => {
    dispatch(setEnabledDimension(!enabledDimension));
  };

  if (isProcessing) return null;

  return (
    <div className={s.container}>
      <IconButton onClick={handleDimension}>
        <DimensionSVG color={enabledDimension ? "#814EFA" : "black"} />
      </IconButton>
      <IconButton onClick={handleHighlightProducts}>
        <ProductInfoSVG />
      </IconButton>
      <IconButton onClick={handleInfo}>
        <InfoSVG />
      </IconButton>
    </div>
  );
};
