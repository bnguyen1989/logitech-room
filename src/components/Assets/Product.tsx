import { useAsset } from "@threekit/react-three-fiber";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as THREE from "three";
import { changeStatusProcessing } from "../../store/slices/configurator/Configurator.slice";
import { ProductsNodes } from "./ProductsNodes.js";
import { GLTFNode } from "./GLTFNode.js";

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

  dispatch(changeStatusProcessing(false));
  // useEffect(() => {
  //   if (!productGltf) return;
  // }, [productGltf]);

  return (
    <group
      key={parentNode.uuid + `-group`}
      position={parentNode.position}
      scale={parentNode.scale}
      rotation={parentNode.rotation}
    >
      <GLTFNode
        threeNode={productGltf.scene.clone()}
        nodeMatchers={ProductsNodes()}
      />
      ;
    </group>
  );
};
