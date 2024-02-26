import { Configurator } from "../../models/configurator/Configurator";
import { NodeMatcher } from "./GLTFNode";
import { ProductNode } from "./ProductNode";

export const ProductsNodes = () => {
  const allNodePlacement = Configurator.getAllPlacement();

  const nodeMatchers: NodeMatcher[] = [
    (threeNode) => {
      if (allNodePlacement.includes(threeNode.name)) {
        return <ProductNode parentNode={threeNode}  nameNode={threeNode.name} />;
      }

      return undefined;
    },
  ];

  return nodeMatchers;
};
