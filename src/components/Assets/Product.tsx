import { useAsset } from "@threekit/react-three-fiber";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeStatusProcessing } from "../../store/slices/configurator/Configurator.slice";

export type ProductProps = {
  parentNode: THREE.Object3D;
  productAssetId: string;
};

export const Product: React.FC<ProductProps> = ({
  parentNode,
  productAssetId,
}) => {
  const dispatch = useDispatch();
  const productGltf = useAsset({ assetId: productAssetId });
  
  useEffect(() => {
    if (!productGltf) return;
    dispatch(changeStatusProcessing(false));
  }, [productGltf]);

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
