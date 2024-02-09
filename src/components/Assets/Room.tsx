import { useAsset } from "@threekit/react-three-fiber";

import { GLTFNode, NodeMatcher } from "./GLTFNode.js";
import { Product } from "./Product.js";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeStatusBuilding } from "../../store/slices/configurator/Configurator.slice.js";

export type RoomProps = {
  roomAssetId: string;
  attachNodeNameToAssetId: Record<string, string>;
};

export const logNode = (node: THREE.Object3D, depth = 0) => {
  const prefix = " ".repeat(depth);
  console.log(`${prefix}${node.name}[${node.constructor.name}]`);
  node.children.forEach((child) => logNode(child, depth + 1));
};

export const Room: React.FC<RoomProps> = ({
  roomAssetId,
  attachNodeNameToAssetId,
}) => {
  const dispatch = useDispatch();
  const gltf = useAsset({ assetId: roomAssetId });
 
  useEffect(() => {
    if (!gltf) return;
    dispatch(changeStatusBuilding(false));
  }, [gltf]);

  const nodeMatchers: NodeMatcher[] = [
    (threeNode) => {
      if (Object.keys(attachNodeNameToAssetId).includes(threeNode.name)) {
          
          if (threeNode.name in attachNodeNameToAssetId) {
         
          return (
            <Product
              parentNode={threeNode}
              productAssetId={attachNodeNameToAssetId[threeNode.name]}
            />
          );
        }
      }
      return undefined;
    },
  ];
  console.log("nodeMatchers", { attachNodeNameToAssetId, nodeMatchers });

  return <GLTFNode threeNode={gltf.scene} nodeMatchers={nodeMatchers} />;
};
