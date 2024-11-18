import { Line, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Mesh } from "three";
import { LabelDimension } from "./HtmlContentDimension/LabelDimension/LabelDimension";
import type { ArrVector3T } from "../../types/mathType";
import { VectorMath } from "../../models/math/VectorMath/VectorMath";
import { getWorldPositionByNode } from "../../utils/dimensionUtils";

interface PropsI {
  nodeA: Mesh;
  nodeB: Mesh;
  label: string;
  offsetPosition?: ArrVector3T;
}

const DimensionBetweenNodes: React.FC<PropsI> = (props) => {
  const { nodeA, nodeB, label, offsetPosition } = props;
  const { camera } = useThree();

  const getWorldPosition = (node: Mesh) => {
    const res = getWorldPositionByNode(node);
    if (offsetPosition) {
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
        <LabelDimension
          text={label}
          type={isHorizontalDirection ? "horizontal" : "vertical"}
        />
      </Text>
    </>
  );
};

export default DimensionBetweenNodes;
