import { Suspense } from "react";
import { NodeMatcher } from "./GLTFNode";
import { ProductNode } from "./ProductNode";
import { PlacementManager } from "../../models/configurator/PlacementManager";

export const ProductsNodes = () => {
  const allNodePlacement = PlacementManager.getAllPlacement();

  // Debug log for RallyBoard_Mount
  if (allNodePlacement.includes("RallyBoard_Mount")) {
    console.log("✅ [ProductsNodes] RallyBoard_Mount is in getAllPlacement()");
  } else {
    console.warn("❌ [ProductsNodes] RallyBoard_Mount is NOT in getAllPlacement()", {
      allNodePlacement,
    });
  }

  const nodeMatchers: NodeMatcher[] = [
    (threeNode) => {
      // Debug log for RallyBoard_Mount
      if (threeNode.name === "RallyBoard_Mount") {
        console.log("🎯 [ProductsNodes] Found RallyBoard_Mount node:", {
          name: threeNode.name,
          isInAllPlacement: allNodePlacement.includes(threeNode.name),
          position: {
            x: threeNode.position.x,
            y: threeNode.position.y,
            z: threeNode.position.z,
          },
        });
      }

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
