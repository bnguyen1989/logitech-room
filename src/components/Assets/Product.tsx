import { useAsset } from "@threekit/react-three-fiber";
import { useDispatch } from "react-redux";
import * as THREE from "three";
import { changeStatusProcessing } from "../../store/slices/configurator/Configurator.slice";
import { ProductsNodes } from "./ProductsNodes.js";
import { GLTFNode } from "./GLTFNode.js";
import { Select } from "@react-three/postprocessing";
import { useEffect } from "react";
import { useAppSelector } from "../../hooks/redux.js";
import { getKeyPermissionFromNameNode } from "../../store/slices/configurator/selectors/selectors.js";
import { AnnotationProductContainer } from "../Annotation/AnnotationProduct/AnnotationContainer.js";
import { StepName } from "../../utils/baseUtils.js";

export type ProductProps = {
  parentNode: THREE.Object3D;
  productAssetId: string;
  highlight?: boolean;
  callbackDisableHighlight: () => void;
  callbackOnHighlight: (nameNode: string) => void;
  nameNode: string;
};

export const Product: React.FC<ProductProps> = ({
  parentNode,
  productAssetId,
  highlight = false,
  callbackDisableHighlight = () => {},
  callbackOnHighlight = () => {},
  nameNode,
}) => {

  const dispatch = useDispatch();
  const productGltf = useAsset({ assetId: productAssetId });
  const keyPermissionObj = useAppSelector(getKeyPermissionFromNameNode(nameNode));

  const sizeProduct = new THREE.Box3()
    .setFromObject(productGltf.scene.clone())
    .getSize(new THREE.Vector3());

  dispatch(changeStatusProcessing(false));

  useEffect(() => {
    if (!productGltf) return;
    const id = setTimeout(() => {
      callbackDisableHighlight();
    }, 3000);

    return () => clearTimeout(id);
  }, [productGltf]);

  return (
    <group
      key={parentNode.uuid + `-group`}
      position={parentNode.position}
      scale={parentNode.scale}
      rotation={parentNode.rotation}
    >
      <Select enabled={highlight} onClick={() => callbackOnHighlight(nameNode)}>

        {highlight && keyPermissionObj !== undefined && Object.keys(keyPermissionObj).length > 0 && (
          <AnnotationProductContainer
            stepPermission={Object.keys(keyPermissionObj)[0] as StepName}
            keyPermission={Object.values(keyPermissionObj)[0]}
            position={[0, sizeProduct.y + 0.4, 0]}
            callbackDisableHighlight={callbackDisableHighlight}
          />
        )}

        <GLTFNode
          threeNode={productGltf.scene.clone()}
          nodeMatchers={ProductsNodes()}
        />
      </Select>
    </group>
  );
};
