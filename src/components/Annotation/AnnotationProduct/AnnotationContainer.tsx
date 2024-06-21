import { useAppSelector } from "../../../hooks/redux";
import {
  getCardByKeyPermission,
  getMetadataProductNameAssetFromCard,
  getTitleCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import { getPropertyColorCardByKeyPermission } from "../../../store/slices/ui/selectors/selectorsColorsCard";
import { Html } from "@react-three/drei";
import { AnnotationProduct } from "./AnnotationProduct";
import { useDispatch } from "react-redux";
import { setAnnotationItemModal } from "../../../store/slices/modals/Modals.slice";
import { StepName } from "../../../utils/baseUtils";
import { useEffect, useRef } from "react";

interface AnnotationProductPropsI {
  stepPermission: StepName;
  keyPermission: string;
  position: [number, number, number],
  callbackDisablePopuptNodes: () => void;
}

export const AnnotationProductContainer: React.FC<AnnotationProductPropsI> = (
  props: AnnotationProductPropsI
) => {
  const { stepPermission, keyPermission, position, callbackDisablePopuptNodes } = props;
  const htmlRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const title = useAppSelector(
    getTitleCardByKeyPermission(stepPermission, keyPermission)
  );
  const card = useAppSelector(
    getCardByKeyPermission(stepPermission, keyPermission)
  );
  const colorValue = useAppSelector(
    getPropertyColorCardByKeyPermission(stepPermission, keyPermission)
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

  const handleClickOutside = (event: MouseEvent) => {
    if (htmlRef.current && !htmlRef.current.contains(event.target as Node)) {
      callbackDisablePopuptNodes();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  if (keyPermission === undefined) return null;

  return (
    <Html
      distanceFactor={40}
      center
      position={position}
      ref={htmlRef} // Прив'язуємо посилання до компонента Html
    >
      <AnnotationProduct annotationText={`${title} - ${colorValue}`} onHandleInfo={handleInfo} />
    </Html>
  );
};
