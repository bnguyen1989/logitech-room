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
import { Configuration } from "@threekit/rest-api";
import { PlacementManager } from "../../models/configurator/PlacementManager.js";

export type ProductProps = {
  parentNode: THREE.Object3D;
  productAssetId: string;
  configuration: Configuration;
  highlight?: boolean;
  popuptNode?: boolean;
  callbackDisableHighlight: () => void;
  callbackOnHighlight: (nameNode: string) => void;
  callbackDisablePopuptNodes: () => void;
  callbackOnPopuptNodes: (nameNode: string) => void;
  nameNode: string;
};

const generateName = (nameNode: string, parentNode: THREE.Object3D): string => {
  return `${nameNode}-${parentNode.uuid}-group`;
};

export const Product: React.FC<ProductProps> = ({
  parentNode,
  productAssetId,
  configuration,
  highlight = false,
  popuptNode = false,
  callbackDisableHighlight = () => {},
  callbackOnHighlight = () => {},
  callbackDisablePopuptNodes = () => {},
  callbackOnPopuptNodes = () => {},
  nameNode,
}) => {
  const dispatch = useDispatch();
  const productGltf = useAsset({ assetId: productAssetId, configuration });
  const keyPermissionObj = useAppSelector(
    getKeyPermissionFromNameNode(nameNode)
  );

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
      name={generateName(nameNode, parentNode)}
      position={parentNode.position}
      scale={parentNode.scale}
      rotation={parentNode.rotation}
    >
      {PlacementManager.getNameNodeWithoutInteraction().includes(nameNode) ? (
        <GLTFNode
          threeNode={productGltf.scene.clone()}
          nodeMatchers={ProductsNodes()}
        />
      ) : (
        <Select
          enabled={highlight}
          onClick={() => {
            callbackOnHighlight(nameNode);
            callbackOnPopuptNodes(nameNode);
          }}
        >
          {popuptNode &&
            keyPermissionObj !== undefined &&
            Object.keys(keyPermissionObj).length > 0 && (
              <AnnotationProductContainer
                stepPermission={Object.keys(keyPermissionObj)[0] as StepName}
                keyPermissions={Object.values(keyPermissionObj)[0]}
                position={[0, sizeProduct.y + 0.8, 0]}
                callbackDisablePopuptNodes={callbackDisablePopuptNodes}
              />
            )}
          <GLTFNode
            threeNode={productGltf.scene.clone()}
            nodeMatchers={ProductsNodes()}
          />
        </Select>
      )}
    </group>
  );
};
