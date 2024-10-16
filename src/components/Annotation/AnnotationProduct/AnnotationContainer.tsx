import { Html } from "@react-three/drei";
import { AnnotationProduct } from "./AnnotationProduct";
import { StepName } from "../../../utils/baseUtils";
import { useEffect, useRef } from "react";
import { useAppSelector } from "../../../hooks/redux";
import { getAnnotationDataByKeyPermissions } from "../../../store/slices/ui/selectors/selectorsAnnotationProduct";
import { useDispatch } from "react-redux";
import { setAnnotationItemModal } from "../../../store/slices/modals/Modals.slice";
import { CardI } from "../../../store/slices/ui/type";

interface AnnotationProductPropsI {
  stepPermission: StepName;
  keyPermissions: string[];
  position: [number, number, number];
  callbackDisablePopuptNodes: () => void;
}

export const AnnotationProductContainer: React.FC<AnnotationProductPropsI> = (
  props: AnnotationProductPropsI
) => {
  const {
    stepPermission,
    keyPermissions,
    position,
    callbackDisablePopuptNodes,
  } = props;
  const htmlRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const dataAnnotation = useAppSelector(
    getAnnotationDataByKeyPermissions(stepPermission, keyPermissions)
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (htmlRef.current && !htmlRef.current.contains(event.target as Node)) {
      callbackDisablePopuptNodes();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const callbackHandleInfo = (productName: string, card: CardI) => {
    dispatch(
      setAnnotationItemModal({
        isOpen: true,
        product: productName,
        keyPermission: card.keyPermission,
        card,
      })
    );
  };

  if (!keyPermissions.length) return null;

  return (
    <Html distanceFactor={40} center position={position} ref={htmlRef}>
      <AnnotationProduct
        dataAnnotation={dataAnnotation}
        callbackHandleInfo={callbackHandleInfo}
      />
    </Html>
  );
};
