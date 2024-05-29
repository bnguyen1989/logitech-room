import { Suspense } from "react";
import { NodeMatcher } from "./GLTFNode";
import { ProductNode } from "./ProductNode";
import { PlacementManager } from "../../models/configurator/PlacementManager";

export const ProductsNodes = () => {
  const allNodePlacement = PlacementManager.getAllPlacement();

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
