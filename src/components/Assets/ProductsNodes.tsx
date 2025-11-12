import { Suspense } from "react";
import { NodeMatcher } from "./GLTFNode";
import { ProductNode } from "./ProductNode";
import { PlacementManager } from "../../models/configurator/PlacementManager";

type ProductsNodesOpts = {
  isRallyBoardSelected?: boolean;
};

export const ProductsNodes = (opts?: ProductsNodesOpts) => {
  const { isRallyBoardSelected = false } = opts || {};
  const allNodePlacement = PlacementManager.getAllPlacement();

  // Debug log for RallyBoard_Mount
  if (allNodePlacement.includes("RallyBoard_Mount")) {
    console.log("✅ [ProductsNodes] RallyBoard_Mount is in getAllPlacement()");
  } else {
    console.warn(
      "❌ [ProductsNodes] RallyBoard_Mount is NOT in getAllPlacement()",
      {
        allNodePlacement,
      }
    );
  }

  const nodeMatchers: NodeMatcher[] = [
    // Matcher 1: Hide/show TV based on RallyBoard selection
    // This runs FIRST to set visibility before rendering
    (threeNode) => {
      const name = threeNode.name || "";
      const nameLower = name.toLowerCase();

      // TV-related name patterns to check
      const tvPatterns = [
        "tv",
        "display",
        "phonebooth_tv",
        "phonebooth_tv_mdl",
        "tv_phonebooth",
        "tv_display_phonebooth",
        "tv_body_phonebooth",
        "tv_mount_phonebooth",
      ];

      // Check if this node matches any TV pattern
      const isTVNode = tvPatterns.some((pattern) => {
        const patternLower = pattern.toLowerCase();
        return (
          nameLower === patternLower ||
          nameLower.includes(patternLower) ||
          nameLower.includes("tv") ||
          (nameLower.includes("display") && nameLower.includes("phonebooth"))
        );
      });

      if (isTVNode) {
        const previousVisible = threeNode.visible;
        threeNode.visible = !isRallyBoardSelected;
        // Hide all children recursively (including nested meshes and groups)
        threeNode.traverse((child) => {
          child.visible = !isRallyBoardSelected;
        });
        console.log("📺 [ProductsNodes] TV node visibility updated:", {
          name,
          previousVisible,
          newVisible: threeNode.visible,
          isRallyBoardSelected,
        });
        // Return undefined to continue traversal (this matcher only does side-effects)
        return undefined;
      }

      return undefined;
    },

    // Matcher 2: Find placement nodes and render ProductNode
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
