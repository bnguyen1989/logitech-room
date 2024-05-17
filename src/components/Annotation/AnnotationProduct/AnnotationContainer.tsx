import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getCardByKeyPermission,
  getMetadataProductNameAssetFromCard,
  getTitleCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import { getPropertyColorCardByKeyPermission } from "../../../store/slices/ui/selectors/selectorsColorsCard";
import { Html } from "@react-three/drei";
import { AnnotationProduct } from "./AnnotationProduct";
import { useDispatch } from "react-redux";
import { setAnnotationItemModal } from "../../../store/slices/modals/Modals.slice";

interface AnnotationProductPropsI {
  keyPermission: string;
  position: [number, number, number]
}

export const AnnotationProductContainer: React.FC<AnnotationProductPropsI> = (
  props: AnnotationProductPropsI
) => {
  const { keyPermission, position } = props;
  const dispatch = useDispatch();
  const activeStep = useAppSelector(getActiveStep);
  const title = useAppSelector(
    getTitleCardByKeyPermission(activeStep, keyPermission)
  );
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyPermission)
  );
  const colorValue = useAppSelector(
    getPropertyColorCardByKeyPermission(activeStep, keyPermission)
  );
  const productName = useAppSelector(getMetadataProductNameAssetFromCard(card));

  const handleInfo = () => {
    dispatch(
      setAnnotationItemModal({
        isOpen: true,
        product: productName,
        keyPermission: keyPermission,
        card: card,
      })
    );
  };

  if (keyPermission === undefined) return null;

  return (
    <Html
      distanceFactor={40}
      center
      position={position}
    >
      <AnnotationProduct annotationText={`${title} - ${colorValue}`} onHandleInfo={handleInfo} />
    </Html>
  );
};
