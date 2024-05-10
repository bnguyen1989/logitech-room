import { FC } from "react";
import { useAppSelector } from "../../hooks/redux";
import {
  getIsHighlightNode,
  getNodes,
} from "../../store/slices/configurator/selectors/selectors";
import { Product } from "./Product";
import * as THREE from "three";
import { useDispatch } from "react-redux";
import { disabledHighlightNode } from "../../store/slices/configurator/Configurator.slice";

type ProductProps = {
  nameNode: string;
  parentNode: THREE.Object3D;
};

export const ProductNode: FC<ProductProps> = ({ nameNode, parentNode }) => {
  console.log("nameNode", nameNode);
  console.log("parentNode", parentNode);

  const dispatch = useDispatch();

  const isHighlightNode = useAppSelector(getIsHighlightNode(nameNode));
  const attachNodeNameToAssetId = useAppSelector(getNodes);

  const callbackDisableHighlight = () => {
    dispatch(disabledHighlightNode(nameNode));
  };

  if (!Object.keys(attachNodeNameToAssetId).includes(nameNode))
    return undefined;

  return (
    <Product
      parentNode={parentNode}
      productAssetId={attachNodeNameToAssetId[nameNode]}
      highlight={isHighlightNode}
      callbackDisableHighlight={callbackDisableHighlight}
    />
  );
};
