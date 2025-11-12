/**
 * Utility to load GLB assets from local files instead of Threekit
 *
 * Usage:
 * 1. Place GLB file in public/assets/models/ folder (or other folder in public/)
 * 2. In card config, set assetId = "/assets/models/rallyboard-wall.glb"
 * 3. Product component will automatically detect and load from local file
 */

import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Type for GLTF object (compatible with both drei and three-stdlib)
 */
export type GLTFResult = ReturnType<typeof useGLTF> & {
  scene: THREE.Scene;
  scenes?: THREE.Scene[];
  animations?: THREE.AnimationClip[];
  cameras?: THREE.Camera[];
  asset?: {
    version?: string;
    generator?: string;
    copyright?: string;
  };
};

/**
 * Check if assetId is a local path
 * Local path usually starts with "/" or "http://" or "https://"
 */
export function isLocalAsset(assetId: string): boolean {
  return (
    assetId.startsWith("/") ||
    assetId.startsWith("http://") ||
    assetId.startsWith("https://") ||
    assetId.endsWith(".glb") ||
    assetId.endsWith(".gltf")
  );
}

/**
 * Hook to load GLB from local file or Threekit
 *
 * @param assetId - Threekit assetId or local path (e.g., "/assets/models/rallyboard.glb")
 * @param useThreekitAsset - Function to load from Threekit (from @threekit/react-three-fiber)
 * @param configuration - Threekit configuration (only used for Threekit assets)
 * @returns GLTF object
 */
export function useLocalOrThreekitAsset(
  assetId: string,
  useThreekitAsset: (params: { assetId: string; configuration?: any }) => any,
  configuration?: any
): GLTFResult {
  // Always call both hooks to comply with Rules of Hooks
  // But only use the result of one of them
  const isLocal = isLocalAsset(assetId);

  // Call useGLTF with fallback path if not a local asset
  // Use an existing GLB file as placeholder to avoid 404 errors
  // (useGLTF will load but we won't use it for Threekit assets)
  const localGltf = useGLTF(
    isLocal ? assetId : "/assets/models/RallyBoard65_Standalone-compressed.glb",
    true
  );

  // Call useThreekitAsset with fallback assetId if it's a local asset
  // (useAsset won't load if assetId is invalid, but hook is still called)
  const threekitGltf = useThreekitAsset({
    assetId: isLocal ? "placeholder-asset-id" : assetId,
    configuration: isLocal ? undefined : configuration,
  });

  // Return the correct result based on asset type
  if (isLocal) {
    return localGltf as GLTFResult;
  } else {
    return threekitGltf as GLTFResult;
  }
}

/**
 * Mapping assetId (from card config) to GLB file path
 *
 * Examples:
 * - "rallyboard-wall-asset-1" → "/assets/models/rallyboard-wall.glb"
 * - "rallyboard-credenza-asset-1" → "/assets/models/rallyboard-credenza.glb"
 *
 * You can customize this mapping as needed
 */
export const LOCAL_ASSET_MAPPING: Record<string, string> = {
  // RallyBoard case 1: on wall (replace TV)
  "rallyboard-wall-asset-1": "/assets/models/rallyboard-wall.glb",
  "rallyboard-mount-asset-1":
    "/assets/models/RallyBoard65_Standalone-compressed.glb",

  // RallyBoard case 2: on credenza
  "rallyboard-credenza-asset-1": "/assets/models/rallyboard-credenza.glb",

  // RallyBoard case 3: on floor with stand
  "rallyboard-floor-asset-1": "/assets/models/rallyboard-floor.glb",
  "rallyboard-stand-asset-1":
    "/assets/models/RallyBoard65_Standalone-compressed.glb",

  // Add other mappings here...
};

/**
 * Resolve assetId to actual path
 * If assetId exists in LOCAL_ASSET_MAPPING, return mapped path
 * Otherwise, return original assetId (could be Threekit assetId or direct path)
 */
export function resolveAssetPath(assetId: string): string {
  return LOCAL_ASSET_MAPPING[assetId] || assetId;
}
