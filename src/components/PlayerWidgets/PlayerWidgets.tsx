import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/redux";
import { getIsProcessing } from "../../store/slices/configurator/selectors/selectors";
import s from "./PlayerWidgets.module.scss";
import { IconButton } from "../Buttons/IconButton/IconButton";
import { InfoSVG, ProductInfoSVG } from "../../assets";
import { setGuideModal } from "../../store/slices/modals/Modals.slice";
import { setHighlightAllProducts } from "../../store/slices/ui/actions/actions";

export const PlayerWidgets: React.FC = () => {
  const dispatch = useDispatch();
  const isProcessing = useAppSelector(getIsProcessing);

  const handleInfo = () => {
    dispatch(setGuideModal({ isOpen: true }));
  };

  const handleHighlightProducts = () => {
    dispatch(setHighlightAllProducts({ isHighlight: true }));

    setTimeout(() => {
      dispatch(setHighlightAllProducts({ isHighlight: false }));
    }, 5000);
  };

  if (isProcessing) return null;

  return (
    <div className={s.container}>
      <IconButton onClick={handleHighlightProducts}>
        <ProductInfoSVG />
      </IconButton>
      <IconButton onClick={handleInfo}>
        <InfoSVG />
      </IconButton>
    </div>
  );
};
