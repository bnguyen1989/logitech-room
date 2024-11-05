import { Line, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { LabelDimension } from "./LabelDimension/LabelDimension";
import type { ArrVector3T } from "../../types/mathType";

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
    const worldPosition = new Vector3();
    node.getWorldPosition(worldPosition);
    const res = worldPosition.toArray() as ArrVector3T;
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

  const midPoint: ArrVector3T = [
    (positionA[0] + positionB[0]) / 2,
    (positionA[1] + positionB[1]) / 1.8,
    (positionA[2] + positionB[2]) / 2,
  ];

  return (
    <>
      <Line
        points={[positionA, positionB]}
        lineWidth={1}
        color="black"
        dashed
        dashSize={0.2}
        gapSize={0.2}
      />

      <Text
        position={midPoint}
        fontSize={0.5}
        color="black"
        anchorX="center"
        anchorY="middle"
        onUpdate={(self) => self.lookAt(camera.position)}
      >
        <LabelDimension text={label} />
      </Text>
    </>
  );
};

export default DimensionBetweenNodes;
