import { FC, useState } from "react";
import { useAppSelector } from "../../hooks/redux";
import {
  getConfiguration,
  getIsHighlightNode,
  getIsPopuptNodes,
  getNodes,
} from "../../store/slices/configurator/selectors/selectors";
import { Product } from "./Product";
import * as THREE from "three";
import { useDispatch } from "react-redux";
import {
  disabledHighlightNode,
  disabledPopuptNodes,
  setHighlightNodes,
  setPopuptNodes,
} from "../../store/slices/configurator/Configurator.slice";

type ProductProps = {
  nameNode: string;
  parentNode: THREE.Object3D;
};

export const ProductNode: FC<ProductProps> = ({ nameNode, parentNode }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const dispatch = useDispatch();

  const isHighlightNode = useAppSelector(
    getIsHighlightNode(selectedNode !== null ? selectedNode : nameNode)
  );
  const isPopuptNode = useAppSelector(
    getIsPopuptNodes(selectedNode !== null ? selectedNode : nameNode)
  );
  const attachNodeNameToAssetId = useAppSelector(getNodes);
  const configuration = useAppSelector(getConfiguration);

  const callbackDisableHighlight = () => {
    setSelectedNode(null);
    dispatch(disabledHighlightNode(nameNode));
  };

  const callbackOnHighlight = (nameNodeParam: string) => {
    setSelectedNode(nameNodeParam);
    dispatch(setHighlightNodes({ [nameNodeParam]: true }));
  };

  const callbackDisablePopuptNodes = () => {
    dispatch(disabledPopuptNodes(nameNode));
  };
  const callbackOnPopuptNodes = (nameNodeParam: string) => {
    dispatch(setPopuptNodes({ [nameNodeParam]: true }));
  };

  if (!Object.keys(attachNodeNameToAssetId).includes(nameNode))
    return undefined;

  return (
    <Product
      parentNode={parentNode}
      configuration={configuration[nameNode]}
      productAssetId={attachNodeNameToAssetId[nameNode]}
      highlight={isHighlightNode}
      popuptNode={isPopuptNode}
      callbackDisableHighlight={callbackDisableHighlight}
      callbackOnHighlight={callbackOnHighlight}
      callbackDisablePopuptNodes={callbackDisablePopuptNodes}
      callbackOnPopuptNodes={callbackOnPopuptNodes}
      nameNode={nameNode}
    />
  );
};
