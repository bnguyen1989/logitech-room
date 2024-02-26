import { useAsset } from "@threekit/react-three-fiber"; 

export type ProductProps = {
  parentNode: THREE.Object3D;
  productAssetId: string;
};

export const Product: React.FC<ProductProps> = ({
  parentNode,
  productAssetId,
}) => {
  const productGltf = useAsset({ assetId: productAssetId });

  return (
    <group
      key={parentNode.uuid + `-group`}
      position={parentNode.position}
      scale={parentNode.scale}
      rotation={parentNode.rotation}
    >
      <primitive object={productGltf.scene.clone()} />
    </group>
  );
};
