import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/redux";
import { getIsProcessing } from "../../store/slices/configurator/selectors/selectors";
import s from "./PlayerWidgets.module.scss";
import { IconButton } from "../Buttons/IconButton/IconButton";
import { InfoSVG, ProductInfoSVG } from "../../assets";
import { setGuideModal } from "../../store/slices/modals/Modals.slice";
import { setHighlightAllProducts } from "../../store/slices/ui/actions/actions";
import { useEffect, useState } from "react";

export const PlayerWidgets: React.FC = () => {
  const dispatch = useDispatch();
  const isProcessing = useAppSelector(getIsProcessing);
  const [isActiveHighlight, setIsActiveHighlight] = useState(false);

  useEffect(() => {
    if (!isActiveHighlight) return;

    setTimeout(() => {
      setIsActiveHighlight(false);
      dispatch(setHighlightAllProducts({ isHighlight: false }));
    }, 5000);
  }, [isActiveHighlight]);

  const handleInfo = () => {
    dispatch(setGuideModal({ isOpen: true }));
  };

  const handleHighlightProducts = () => {
    dispatch(setHighlightAllProducts({ isHighlight: true }));
    setIsActiveHighlight(true);
  };

  if (isProcessing) return null;

  return (
    <div className={s.container}>
      <IconButton onClick={handleHighlightProducts}>
        <ProductInfoSVG color={isActiveHighlight ? "#814EFA" : "black"} />
      </IconButton>
      <IconButton onClick={handleInfo}>
        <InfoSVG />
      </IconButton>
    </div>
  );
};
