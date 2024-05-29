import { FC, useState } from "react";
import { useAppSelector } from "../../hooks/redux";
import {
  getIsHighlightNode,
  getNodes,
} from "../../store/slices/configurator/selectors/selectors";
import { Product } from "./Product";
import * as THREE from "three";
import { useDispatch } from "react-redux";
import { disabledHighlightNode, setHighlightNodes } from "../../store/slices/configurator/Configurator.slice";

type ProductProps = {
  nameNode: string;
  parentNode: THREE.Object3D;
};

export const ProductNode: FC<ProductProps> = ({ nameNode, parentNode }) => {

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const dispatch = useDispatch();

  const isHighlightNode = useAppSelector(getIsHighlightNode(selectedNode !== null ? selectedNode : nameNode));
  const attachNodeNameToAssetId = useAppSelector(getNodes);

  const callbackDisableHighlight = () => {
    setSelectedNode(null);
    dispatch(disabledHighlightNode(nameNode));
  };

  const callbackOnHighlight = (nameNodeParam: string) => {
    setSelectedNode(nameNodeParam);
    dispatch(setHighlightNodes({ [nameNodeParam]: true } ));
  };

  if (!Object.keys(attachNodeNameToAssetId).includes(nameNode))
    return undefined;

  return (
    <Product
      parentNode={parentNode}
      productAssetId={attachNodeNameToAssetId[nameNode]}
      highlight={isHighlightNode}
      callbackDisableHighlight={callbackDisableHighlight}
      callbackOnHighlight={callbackOnHighlight}
      nameNode={nameNode}
    />
  );
};
