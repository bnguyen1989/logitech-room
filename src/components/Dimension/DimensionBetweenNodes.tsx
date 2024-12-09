import { Line, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Mesh } from "three";
import { LabelDimension } from "./HtmlContentDimension/LabelDimension/LabelDimension";
import type { ArrVector3T, OrientationT } from "../../types/mathType";
import { VectorMath } from "../../models/math/VectorMath/VectorMath";
import { getWorldPositionByNode } from "../../utils/dimensionUtils";
import { PositionDimensionNodeI } from "../../models/dimension/type";

interface PropsI {
  nodeA: Mesh;
  nodeB: Mesh;
  label: string;
  position?: PositionDimensionNodeI;
}

const DimensionBetweenNodes: React.FC<PropsI> = (props) => {
  const { nodeA, nodeB, label, position } = props;
  const { camera } = useThree();

  const getWorldPosition = (node: Mesh) => {
    const res = getWorldPositionByNode(node);
    if (position?.offsetPosition) {
      const offsetPosition = position.offsetPosition;
      return [
        res[0] + offsetPosition[0],
        res[1] + offsetPosition[1],
        res[2] + offsetPosition[2],
      ] as ArrVector3T;
    }
    return res;
  };

  const positionA = getWorldPosition(nodeA);
  const positionB = getWorldPosition(nodeB);

  const midPoint: ArrVector3T = VectorMath.getMidPoint(
    [...positionA],
    [...positionB]
  );

  const isHorizontalDirection = new VectorMath("XZ", 1).isHorizontal(
    [...positionA],
    [...positionB]
  );

  const getPositionHashMark = (length: number) => {
    const vectorMath = new VectorMath("XZ", 1);
    const perpendicularPoints = vectorMath.getPerpendicularPoints(
      [...positionA],
      [...positionB],
      length
    );
    const distance = vectorMath.getDistance([...positionA], [...positionB]) / 2;
    const direction = vectorMath.getDirection([...positionA], [...positionB]);
    return [
      vectorMath.movePoint([...perpendicularPoints[0]], direction, distance),
      vectorMath.movePoint([...perpendicularPoints[1]], direction, distance),
    ];
  };

  const typeLabel: OrientationT =
    position?.orientation ?? isHorizontalDirection ? "horizontal" : "vertical";

  return (
    <>
      <Line points={[positionA, positionB]} lineWidth={2} color="black" />
      <Line points={getPositionHashMark(0.5)} lineWidth={1} color="black" />

      <Text
        position={midPoint}
        fontSize={0.5}
        color="black"
        anchorX="center"
        anchorY="middle"
        onUpdate={(self) => self.lookAt(camera.position)}
      >
        <LabelDimension text={label} type={typeLabel} />
      </Text>
    </>
  );
};

export default DimensionBetweenNodes;
