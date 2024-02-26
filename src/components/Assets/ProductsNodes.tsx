import { Suspense } from "react";
import { Configurator } from "../../models/configurator/Configurator";
import { NodeMatcher } from "./GLTFNode";
import { ProductNode } from "./ProductNode";

export const ProductsNodes = () => {
  const allNodePlacement = Configurator.getAllPlacement();

  const nodeMatchers: NodeMatcher[] = [
    (threeNode) => {
      if (allNodePlacement.includes(threeNode.name)) {
        return (
          <Suspense>
            <ProductNode parentNode={threeNode} nameNode={threeNode.name} />
          </Suspense>
        );
      }

      return undefined;
    },
  ];

  return nodeMatchers;
};
