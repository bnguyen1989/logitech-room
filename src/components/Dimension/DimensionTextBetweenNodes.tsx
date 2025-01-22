import { useThree } from "@react-three/fiber";
import { Mesh } from "three";
import { ArrVector3T } from "../../types/mathType";
import { VectorMath } from "../../models/math/VectorMath/VectorMath";
import { TextDimension } from "./HtmlContentDimension/TextDimension/TextDimension";
import { Text } from "@react-three/drei";
import { getWorldPositionByNode } from "../../utils/dimensionUtils";
import { DimensionStyleI } from "../../models/dimension/type";
import { useDeviceType } from "../../hooks/deviceType";

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

  const positionA = getWorldPositionByNode(nodeA);
  const positionB = getWorldPositionByNode(nodeB);

  const midPoint: ArrVector3T = VectorMath.getMidPoint(
    [...positionA],
    [...positionB]
  );

  const styleObj = style ? (isMobile ? style.mobile : style.desktop) : {};

  return (
    <Text
      position={midPoint}
      color="black"
      anchorX="center"
      anchorY="middle"
      onUpdate={(self) => self.lookAt(camera.position)}
    >
      <TextDimension text={label} type={"horizontal"} style={styleObj} />
    </Text>
  );
};
