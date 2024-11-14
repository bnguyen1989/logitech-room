import { useThree } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { ArrVector3T } from "../../types/mathType";
import { VectorMath } from "../../models/math/VectorMath/VectorMath";
import { TextDimension } from "./TextDimension/TextDimension";
import { Text } from "@react-three/drei";

interface PropsI {
  nodeA: Mesh;
  nodeB: Mesh;
  label: string;
}
export const DimensionTextBetweenNodes: React.FC<PropsI> = (props) => {
  const { nodeA, nodeB, label } = props;
  const { camera } = useThree();

  const getWorldPosition = (node: Mesh) => {
    const worldPosition = new Vector3();
    node.getWorldPosition(worldPosition);
    return worldPosition.toArray() as ArrVector3T;
  };

  const positionA = getWorldPosition(nodeA);
  const positionB = getWorldPosition(nodeB);

  const midPoint: ArrVector3T = VectorMath.getMidPoint(
    [...positionA],
    [...positionB]
  );

  return (
    <Text
      position={midPoint}
      color="black"
      anchorX="center"
      anchorY="middle"
      onUpdate={(self) => self.lookAt(camera.position)}
    >
      <TextDimension text={label} type="horizontal" />
    </Text>
  );
};
