import { Suspense } from "react";
import { NodeMatcher } from "./GLTFNode";
import { ProductNode } from "./ProductNode";
import { PlacementManager } from "../../models/configurator/PlacementManager";
import { useAppSelector } from "../../hooks/redux";
import { getNodes } from "../../store/slices/configurator/selectors/selectors";

export const ProductsNodes = () => {
  const allNodePlacement = PlacementManager.getAllPlacement();
  const nodes = useAppSelector(getNodes);
  const deviceMountNodeName = PlacementManager.getNameNodeForDeviceMount();

  // Check if Device_Mount has a device mounted
  const isDeviceMounted = !!nodes[deviceMountNodeName];

  const nodeMatchers: NodeMatcher[] = [
    // Hide TV when device is mounted to Device_Mount
    (threeNode) => {
      const nodeNameLower = threeNode.name.toLowerCase();

      if (nodeNameLower.includes("tv")) {
        // Hide TV if device is mounted
        threeNode.visible = !isDeviceMounted;
        return undefined;
      }
      return undefined;
    },

    // Match placement nodes and render ProductNode
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
