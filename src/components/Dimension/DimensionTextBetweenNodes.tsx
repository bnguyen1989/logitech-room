import { useThree } from "@react-three/fiber";
import { Mesh } from "three";
import { ArrVector3T } from "../../types/mathType";
import { VectorMath } from "../../models/math/VectorMath/VectorMath";
import { TextDimension } from "./HtmlContentDimension/TextDimension/TextDimension";
import { Text } from "@react-three/drei";
import { getWorldPositionByNode } from "../../utils/dimensionUtils";
import { DimensionStyleI } from "../../models/dimension/type";
import { useDeviceType } from "../../hooks/deviceType";
import { useAppSelector } from "../../hooks/redux";
import { getDimensionLangPage } from "../../store/slices/ui/selectors/selectoteLangPage";
import { useCallback } from "react";

interface PropsI {
  nodeA: Mesh;
  nodeB: Mesh;
  label: string;
  style?: DimensionStyleI;
}
export const DimensionTextBetweenNodes: React.FC<PropsI> = (props) => {
  const { nodeA, nodeB, label, style } = props;
  const { camera } = useThree();
  const { isMobile } = useDeviceType();
  const dimensionLang = useAppSelector(getDimensionLangPage);

  const positionA = getWorldPositionByNode(nodeA);
  const positionB = getWorldPositionByNode(nodeB);

  const midPoint: ArrVector3T = VectorMath.getMidPoint(
    [...positionA],
    [...positionB]
  );

  const styleObj = style ? (isMobile ? style.mobile : style.desktop) : {};

  const getLabel = useCallback(() => {
    let template = dimensionLang.Text.SizeTable.v1;
    const arr = label.split(" ");
    const everySize = arr.every((item) => item.includes(":"));
    if (!arr.length || !everySize) return label;
    if (arr.length > 2) {
      template = dimensionLang.Text.SizeTable.v2;
    }

    arr.forEach((element) => {
      const [key, value] = element.split(":");
      template = template.replace(key, value);
    });

    return template;
  }, [dimensionLang.Text.SizeTable.v1, dimensionLang.Text.SizeTable.v2, label]);

  return (
    <Text
      position={midPoint}
      color="black"
      anchorX="center"
      anchorY="middle"
      onUpdate={(self) => self.lookAt(camera.position)}
    >
      <TextDimension text={getLabel()} type={"horizontal"} style={styleObj} />
    </Text>
  );
};
