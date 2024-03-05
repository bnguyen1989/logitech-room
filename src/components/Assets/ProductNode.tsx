import { FC } from "react";
import { useAppSelector } from "../../hooks/redux";
import { getNodes } from "../../store/slices/configurator/selectors/selectors";
import { Product } from "./Product";
import * as THREE from "three";

type ProductProps = {
  nameNode: string;
  parentNode: THREE.Object3D;
};

export const ProductNode: FC<ProductProps> = ({ nameNode, parentNode }) => {
  const attachNodeNameToAssetId = useAppSelector(getNodes);
  if (!Object.keys(attachNodeNameToAssetId).includes(nameNode))
    return undefined;

  return (
    <Product
      parentNode={parentNode}
      productAssetId={attachNodeNameToAssetId[nameNode]}
    />
  );
};
