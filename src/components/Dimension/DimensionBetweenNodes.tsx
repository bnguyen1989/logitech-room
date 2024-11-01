import { Line, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { LabelDimension } from "./LabelDimension/LabelDimension";

interface DimensionBetweenNodesProps {
  nodeA: Mesh;
  nodeB: Mesh;
  label: string;
}

const DimensionBetweenNodes: React.FC<DimensionBetweenNodesProps> = ({
  nodeA,
  nodeB,
  label,
}) => {
  const { camera } = useThree();

  const getWorldPosition = (node: Mesh) => {
    const worldPosition = new Vector3();
    node.getWorldPosition(worldPosition);
    return worldPosition.toArray() as [number, number, number];
  };

  const positionA = getWorldPosition(nodeA);
  const positionB = getWorldPosition(nodeB);

  const midPoint: [number, number, number] = [
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
