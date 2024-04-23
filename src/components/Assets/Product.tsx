import { useAsset } from "@threekit/react-three-fiber";
import { useDispatch } from "react-redux";
import * as THREE from "three";
import { changeStatusProcessing } from "../../store/slices/configurator/Configurator.slice";
import { ProductsNodes } from "./ProductsNodes.js";
import { GLTFNode } from "./GLTFNode.js";
import { Select } from "@react-three/postprocessing";
import { useEffect, useState } from "react";

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
  const [highlight, setHighlight] = useState(true);

  dispatch(changeStatusProcessing(false));

  useEffect(() => {
    if (!productGltf) return;
    const id = setTimeout(() => {
      setHighlight(false);
    }, 2000);

    return () => clearTimeout(id);
  }, [productGltf]);

  return (
    <group
      key={parentNode.uuid + `-group`}
      position={parentNode.position}
      scale={parentNode.scale}
      rotation={parentNode.rotation}
    >
      <Select enabled={highlight}>
        <GLTFNode
          threeNode={productGltf.scene.clone()}
          nodeMatchers={ProductsNodes()}
        />
      </Select>
    </group>
  );
};
