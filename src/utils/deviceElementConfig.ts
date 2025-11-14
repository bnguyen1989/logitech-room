/**
 * Utility to create Elements from JSON config for local GLB devices
 *
 * This allows creating Elements for multiple devices without writing separate code for each device.
 *
 * Usage:
 * 1. Add device element config to deviceElements.json
 * 2. Import and call registerDeviceElementsFromConfig() in permissionUtils.ts
 * 3. Elements will be automatically created and added to step
 */

import { ItemElement } from "../models/permission/elements/ItemElement";
import { MountElement } from "../models/permission/elements/mounts/MountElement";
import { GroupElement } from "../models/permission/elements/GroupElement";
import { PlacementManager } from "../models/configurator/PlacementManager";
import { Step } from "../models/permission/step/Step";

/**
 * Configuration for a device Element
 */
export interface DeviceElementConfig {
  keyPermission: string; // Key permission (must match card.keyPermission)
  // Either nodeName OR placementManagerMethod must be provided
  nodeName?: string; // Placement node name (must exist in GLTF scene) - use if placementManagerMethod is not provided
  placementManagerMethod?: {
    // Use PlacementManager method to get nodeName - use if nodeName is not provided
    method: string; // Method name in PlacementManager (e.g., "getNameNodeForRallyBoardMount")
    args?: any[]; // Arguments for the method
  };
}

/**
 * Create ItemElement with MountElement from config
 *
 * @param config - Device element configuration
 * @returns ItemElement with default mount
 */
export function createDeviceElement(config: DeviceElementConfig): ItemElement {
  let nodeName: string;

  // If placementManagerMethod is provided, use it to get nodeName
  if (config.placementManagerMethod) {
    const methodName = config.placementManagerMethod.method;
    const args = config.placementManagerMethod.args || [];

    // Get method from PlacementManager
    const method = (PlacementManager as any)[methodName];
    if (typeof method !== "function") {
      throw new Error(`PlacementManager method "${methodName}" not found`);
    }

    // Call method with args
    nodeName = method.apply(PlacementManager, args);
  } else if (config.nodeName) {
    // Use direct nodeName
    nodeName = config.nodeName;
  } else {
    // Neither placementManagerMethod nor nodeName provided
    throw new Error(
      `Either "nodeName" or "placementManagerMethod" must be provided for keyPermission: ${config.keyPermission}`
    );
  }

  // Create ItemElement with MountElement
  const itemElement = new ItemElement(config.keyPermission).setDefaultMount(
    new MountElement(config.keyPermission, nodeName)
  );

  return itemElement;
}

/**
 * Create GroupElement containing ItemElement from config
 *
 * @param config - Device element configuration
 * @returns GroupElement containing ItemElement
 */
export function createDeviceGroupElement(
  config: DeviceElementConfig
): GroupElement {
  const itemElement = createDeviceElement(config);
  return new GroupElement().addElement(itemElement);
}

/**
 * Register device elements from config array to a step
 *
 * @param step - Step to add elements to
 * @param configs - Array of device element configurations
 */
export function registerDeviceElementsToStep(
  step: Step,
  configs: DeviceElementConfig[]
): void {
  // Ensure step.allElements exists
  if (!step.allElements) {
    step.allElements = [];
  }

  configs.forEach((config) => {
    const groupElement = createDeviceGroupElement(config);

    // Add GroupElement directly to step.allElements
    // This is correct because step.allElements accepts Array<ItemElement | GroupElement>
    // and getSimpleElements() will extract ItemElement from GroupElement
    step.allElements.push(groupElement);

    console.log(
      `✅ [registerDeviceElementsToStep] Added element "${config.keyPermission}" to step "${step.name}"`
    );
  });

  console.log(
    `✅ [registerDeviceElementsToStep] Total elements in step "${step.name}": ${step.allElements.length}`
  );
}

/**
 * Create device elements from config and return as array of GroupElement
 * This is useful if you want to manually add to step.allElements
 *
 * @param configs - Array of device element configurations
 * @returns Array of GroupElement that can be added to step.allElements
 */
export function createDeviceElementsForStep(
  configs: DeviceElementConfig[]
): GroupElement[] {
  return configs.map((config) => createDeviceGroupElement(config));
}

/**
 * Register device elements from config array (returns GroupElement array)
 *
 * @param configs - Array of device element configurations
 * @returns Array of GroupElement
 */
export function createDeviceGroupElements(
  configs: DeviceElementConfig[]
): GroupElement[] {
  return configs.map((config) => createDeviceGroupElement(config));
}
