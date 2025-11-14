import { useAsset } from "@threekit/react-three-fiber";
import { useDispatch } from "react-redux";
import * as THREE from "three";
import { changeStatusProcessing } from "../../store/slices/configurator/Configurator.slice";
import { ProductsNodes } from "./ProductsNodes.js";
import { GLTFNode } from "./GLTFNode.js";
import { Select } from "@react-three/postprocessing";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "../../hooks/redux.js";
import { getKeyPermissionFromNameNode } from "../../store/slices/configurator/selectors/selectors.js";
import { AnnotationProductContainer } from "../Annotation/AnnotationProduct/AnnotationContainer.js";
import { StepName } from "../../utils/baseUtils.js";
import { Configuration } from "@threekit/rest-api";
import { PlacementManager } from "../../models/configurator/PlacementManager.js";
import {
  LOCAL_ASSET_MAPPING,
  isLocalAsset,
} from "../../utils/localAssetLoader.js";
import {
  NormalizeGLBOptions,
  normalizeGLBScene,
} from "../../utils/glbTransformUtils.js";

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

const DEFAULT_LOCAL_GLB_OPTIONS: NormalizeGLBOptions = {
  center: true,
};

const LOCAL_GLB_TRANSFORMS: Record<string, NormalizeGLBOptions> = {
  "rallyboard-mount-asset-1": {
    center: true,
    rotation: {
      y: Math.PI,
    },
  },
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
  const isLocalGlbAsset =
    Boolean(LOCAL_ASSET_MAPPING[productAssetId]) ||
    isLocalAsset(productAssetId);

  const normalizedScene = useMemo(() => {
    if (!productGltf?.scene || !isLocalGlbAsset) {
      return productGltf?.scene ?? null;
    }

    const transformOptions =
      LOCAL_GLB_TRANSFORMS[productAssetId] ?? DEFAULT_LOCAL_GLB_OPTIONS;

    return normalizeGLBScene(productGltf.scene, {
      ...DEFAULT_LOCAL_GLB_OPTIONS,
      ...transformOptions,
    });
  }, [isLocalGlbAsset, productAssetId, productGltf]);

  const sceneToRender = normalizedScene ?? productGltf?.scene;

  if (!sceneToRender) {
    return null;
  }

  const sizeProduct = new THREE.Box3()
    .setFromObject(sceneToRender.clone())
    .getSize(new THREE.Vector3());

  dispatch(changeStatusProcessing(false));

  useEffect(() => {
    if (!sceneToRender) return;
    const id = setTimeout(() => {
      callbackDisableHighlight();
    }, 3000);

    return () => clearTimeout(id);
  }, [sceneToRender]);

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
          threeNode={sceneToRender.clone()}
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
                position={[0, sizeProduct.y / 2, 0]}
                callbackDisablePopuptNodes={callbackDisablePopuptNodes}
              />
            )}
          <GLTFNode
            threeNode={sceneToRender.clone()}
            nodeMatchers={ProductsNodes()}
          />
        </Select>
      )}
    </group>
  );
};
