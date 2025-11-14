import { Html } from "@react-three/drei";
import { AnnotationProduct } from "./AnnotationProduct";
import { StepName } from "../../../utils/baseUtils";
import { useEffect, useRef } from "react";
import { useAppSelector } from "../../../hooks/redux";
import { getAnnotationDataByKeyPermissions } from "../../../store/slices/ui/selectors/selectorsAnnotationProduct";
import { useDispatch } from "react-redux";
import { setAnnotationItemModal } from "../../../store/slices/modals/Modals.slice";
import { CardI } from "../../../store/slices/ui/type";
import {
  AudioExtensionName,
  CameraName,
  VideoAccessoryName,
} from "../../../utils/permissionUtils";

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
    const variant = getVariantAnnotation();
    const isRallyBoardItem = keyPermissions.some((key) =>
      key.toLowerCase().includes("rallyboard")
    );
    const rallyBoardOffset = 0.35; // 5 cm

    if (variant === "top") {
      const topOffset = isRallyBoardItem ? rallyBoardOffset : 0.2;
      return [position[0], position[1] + topOffset, position[2]];
    }

    const offset = keyPermissions.includes(VideoAccessoryName.LogitechScribe)
      ? 0
      : isRallyBoardItem
      ? rallyBoardOffset
      : 0.6;

    return [position[0], position[1] + offset, position[2]];
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
