import { Suspense } from "react";
import * as THREE from "three";
import { NodeMatcher } from "./GLTFNode";
import { ProductNode } from "./ProductNode";
import { PlacementManager } from "../../models/configurator/PlacementManager";

type ProductsNodesOpts = {
  isRallyBoardSelected?: boolean;
  isRallyBoardFloorSelected?: boolean;
};

export const ProductsNodes = (opts?: ProductsNodesOpts) => {
  const { isRallyBoardSelected = false, isRallyBoardFloorSelected = false } =
    opts || {};
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

      console.log("name lower", nameLower);

      // Detailed logging for wall_in_panels___
      if (nameLower === "wall_in_panels___") {
        console.log("🔍 [ProductsNodes] Found wall_in_panels___ node:", {
          name: threeNode.name,
          position: {
            x: threeNode.position.x,
            y: threeNode.position.y,
            z: threeNode.position.z,
          },
          rotation: {
            x: threeNode.rotation.x,
            y: threeNode.rotation.y,
            z: threeNode.rotation.z,
          },
          scale: {
            x: threeNode.scale.x,
            y: threeNode.scale.y,
            z: threeNode.scale.z,
          },
          visible: threeNode.visible,
          childrenCount: threeNode.children.length,
        });

        // Log all children
        console.log(
          "📦 [ProductsNodes] wall_in_panels___ children:",
          threeNode.children.map((child) => ({
            name: child.name,
            type: child.constructor.name,
            visible: child.visible,
          }))
        );

        // Traverse and find all meshes and materials
        const meshes: any[] = [];
        const materials: any[] = [];
        const blackMaterials: any[] = [];

        threeNode.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const meshInfo: any = {
              name: child.name,
              visible: child.visible,
              position: {
                x: child.position.x,
                y: child.position.y,
                z: child.position.z,
              },
            };

            const meshMaterials = Array.isArray(child.material)
              ? child.material
              : [child.material];

            meshMaterials.forEach((material, idx) => {
              const materialInfo: any = {
                meshName: child.name,
                materialIndex: idx,
                type: material.constructor.name,
              };

              // Check if material has color property
              if (material.color) {
                const color = material.color;
                materialInfo.color = {
                  r: color.r,
                  g: color.g,
                  b: color.b,
                  hex: `#${color.getHexString()}`,
                };

                // Check if it's black (very dark color)
                const isBlack = color.r < 0.1 && color.g < 0.1 && color.b < 0.1;
                materialInfo.isBlack = isBlack;

                if (isBlack) {
                  blackMaterials.push({
                    ...materialInfo,
                    mesh: meshInfo,
                  });
                }
              }

              // Check other material properties
              if (material.emissive) {
                materialInfo.emissive = {
                  r: material.emissive.r,
                  g: material.emissive.g,
                  b: material.emissive.b,
                  hex: `#${material.emissive.getHexString()}`,
                };
              }

              if (material.map) {
                materialInfo.hasTexture = true;
                materialInfo.textureName = material.map.name || "unnamed";
              }

              materials.push(materialInfo);
            });

            meshInfo.materialCount = meshMaterials.length;
            meshes.push(meshInfo);
          }
        });

        if (blackMaterials.length > 0) {
          console.log(
            "⚫ [ProductsNodes] wall_in_panels___ BLACK MATERIALS FOUND:",
            blackMaterials
          );
        } else {
          console.log(
            "✅ [ProductsNodes] wall_in_panels___ No black materials found"
          );
        }
      }

      if (nameLower.includes("tv")) {
        const previousVisible = threeNode.visible;
        threeNode.visible = !isRallyBoardSelected;
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

      const isCredenzaMesh = ["credenza", "cabinet", "sideboard"].some((key) =>
        nameLower.includes(key)
      );
      if (isCredenzaMesh) {
        const newVisible = !isRallyBoardFloorSelected;
        const previousVisible = threeNode.visible;
        threeNode.visible = newVisible;
        threeNode.traverse((child) => {
          child.visible = newVisible;
        });
        console.log("🪑 [ProductsNodes] credenza visibility updated:", {
          name,
          previousVisible,
          newVisible,
          isRallyBoardFloorSelected,
        });
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
