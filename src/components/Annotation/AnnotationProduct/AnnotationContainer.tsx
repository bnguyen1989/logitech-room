import { Html } from "@react-three/drei";
import { AnnotationProduct } from "./AnnotationProduct";
import { StepName } from "../../../utils/baseUtils";
import { useCallback, useEffect, useRef } from "react";
import { useAppSelector } from "../../../hooks/redux";
import { getAnnotationDataByKeyPermissions } from "../../../store/slices/ui/selectors/selectorsAnnotationProduct";
import { useDispatch } from "react-redux";
import { setAnnotationItemModal } from "../../../store/slices/modals/Modals.slice";
import { CardI } from "../../../store/slices/ui/type";
import { AudioExtensionName, CameraName } from "../../../utils/permissionUtils";

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

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (htmlRef.current && !htmlRef.current.contains(event.target as Node)) {
        callbackDisablePopuptNodes();
      }
    },
    [callbackDisablePopuptNodes]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

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

  const getVariantAnnotation = () => {
    console.log("keyPermissions", keyPermissions);

    const isTopPosition = [
      AudioExtensionName.RallyMicPodPendantMount,
      CameraName.RallyCamera,
    ].some((key) => keyPermissions.includes(key));

    if (isTopPosition) return "top";
    return "bottom";
  };

  const getPosition = (): [number, number, number] => {
    const TOOLTIP_OFFSET_METERS = 0.35; // 35 cm for all items
    return [position[0], position[1] + TOOLTIP_OFFSET_METERS, position[2]];
  };

  if (!keyPermissions.length) return null;

  return (
    <Html
      zIndexRange={[1]}
      distanceFactor={40}
      center
      position={getPosition()}
      ref={htmlRef}
    >
      <AnnotationProduct
        dataAnnotation={dataAnnotation}
        callbackHandleInfo={callbackHandleInfo}
        position={getVariantAnnotation()}
      />
    </Html>
  );
};
