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
 * Hook to load GLB from local file
 *
 * @param assetPath - Local path to GLB file (e.g., "/assets/models/rallyboard.glb")
 * @returns GLTF object
 */
export function useLocalAsset(assetPath: string): GLTFResult {
  const localGltf = useGLTF(assetPath, true);
  return localGltf as GLTFResult;
}

/**
 * Hook to load GLB from Threekit
 *
 * @param assetId - Threekit assetId
 * @param useThreekitAsset - Function to load from Threekit (from @threekit/react-three-fiber)
 * @param configuration - Threekit configuration
 * @returns GLTF object
 */
export function useThreekitAsset(
  assetId: string,
  useThreekitAssetHook: (params: {
    assetId: string;
    configuration?: any;
  }) => any,
  configuration?: any
): GLTFResult | null {
  // Always call the hook to comply with Rules of Hooks
  // If assetId is empty or invalid, useAsset will still be called but may fail
  // We'll return null for local assets (empty assetId case)
  const threekitGltf = useThreekitAssetHook({
    assetId: assetId,
    configuration: configuration,
  });

  // Return null if assetId was empty (local asset case)
  // Otherwise return the loaded GLTF
  // Note: If useAsset fails with invalid assetId, threekitGltf may be null/undefined
  // which is fine - we'll use localGltf as fallback in Product.tsx
  return assetId && assetId.trim() !== "" ? (threekitGltf as GLTFResult) : null;
}

/*
 Mapping assetId (from card config) to GLB file path
 */
export const LOCAL_ASSET_MAPPING: Record<string, string> = {
  // RallyBoard case 1: on wall (replace TV)

  "rallyboard-mount-asset-1":
    "/assets/models/RallyBoard65_Standalone-compressed.glb",

  // RallyBoard case 2: on credenza
  "rallyboard-credenza-asset-1":
    "/assets/models/RallyBoard65_CredenzaFeet_CameraBelow-compressed.glb",

  // RallyBoard case 3: on floor with stand
  "rallyboard-floor-asset-1":
    "/assets/models/RallyBoard65_Cart_CameraAbove-compressed.glb",
  "rallyboard-floor-asset-2":
    "/assets/models/RallyBoard65_Cart_CameraBelow-compressed.glb",
};
/**
 * Resolve assetId to actual path
 * If assetId exists in LOCAL_ASSET_MAPPING, return mapped path
 * Otherwise, return original assetId (could be Threekit assetId or direct path)
 */
export function resolveAssetPath(assetId: string): string {
  return LOCAL_ASSET_MAPPING[assetId] || assetId;
}
