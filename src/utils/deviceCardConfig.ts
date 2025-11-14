/**
 * Utility to create device cards from JSON config
 *
 * This allows creating cards for multiple devices without writing separate functions for each device.
 *
 * Usage:
 * 1. Add device config to deviceCards.json
 * 2. Import and call registerDevicesFromConfig(store) in handlers.ts
 * 3. Cards will be automatically created and added to Redux store
 */

import { Store } from "redux";
import { StepName } from "../utils/baseUtils";
import { CardI, CounterI } from "../store/slices/ui/type";
import { ValueAssetStateI } from "../models/configurator/type";
import { setDataCardsStep } from "../store/slices/ui/Ui.slice";
import { createItem } from "../store/slices/ui/Ui.slice";

export interface DeviceCardConfig {
  deviceId: string; // Unique device ID
  keyPermission: string; // Key permission (must match element.name)
  step: StepName | string; // Step name (e.g., "Conference Camera" or StepName.ConferenceCamera)
  assetId: string; // Asset ID (key in LOCAL_ASSET_MAPPING)
  attributeName: string; // Attribute name
  counter?: {
    // Counter configuration
    min: number;
    max: number;
  };
  image?: string; // Image path
  logo?: string; // Logo path
  subtitle?: string; // Subtitle
  description?: string; // Description
}

/**
 * Create ValueAssetStateI from device config
 * This is used in CardI.dataThreekit.threekitItems
 */
function createValueAssetState(config: DeviceCardConfig): ValueAssetStateI {
  return {
    id: config.assetId,
    assetId: config.assetId,
    key: config.keyPermission,
    name: config.keyPermission,
    type: "asset",
    orgId: "",
    metadata: {},
    tags: [],
    parentFolderId: "",
    advancedAr: false,
    proxyId: "",
    publishedAt: "",
    updatedBy: "",
    proxyType: "",
    warnings: false,
    fileSize: 0,
    tagids: [],
    head: "",
    analytics: false,
    attributes: [],
    enabled: true,
    visible: true,
  };
}

/**
 * Create CounterI from device config
 */
function createCounter(config: DeviceCardConfig): CounterI | undefined {
  if (!config.counter) {
    return undefined;
  }
  return {
    min: config.counter.min,
    max: config.counter.max,
    threekit: {
      key: "",
    },
  };
}

/**
 * Create CardI from device config
 */
export function createDeviceCard(config: DeviceCardConfig): CardI {
  const valueAssetState = createValueAssetState(config);
  const counter = createCounter(config);

  // Convert step to StepName if it's a string
  const step: StepName =
    typeof config.step === "string" ? (config.step as StepName) : config.step;

  const card: CardI = {
    key: step,
    keyPermission: config.keyPermission,
    dataThreekit: {
      attributeName: config.attributeName,
      threekitItems: {
        [config.keyPermission]: valueAssetState,
      },
    },
    counter,
    image: config.image,
    logo: config.logo,
    subtitle: config.subtitle,
    description: config.description,
  };

  return card;
}

/**
 * Register a single device card to Redux store
 *
 * Note: This function does NOT handle card sorting. If you need sorted cards,
 * use registerDeviceCardWithSorting() or handle sorting in handlers.ts
 */
export function registerDeviceCard(
  store: Store,
  config: DeviceCardConfig
): void {
  const card = createDeviceCard(config);
  const state = store.getState();

  // Convert step to StepName if it's a string
  const step: StepName =
    typeof config.step === "string" ? (config.step as StepName) : config.step;

  const stepData = state.ui.stepData[step];

  if (!stepData) {
    console.warn(
      `⚠️ [registerDeviceCard] Step not found: ${step}`,
      config,
      `Available steps:`,
      Object.keys(state.ui.stepData)
    );
    return;
  }

  // Merge card with existing cards
  const existingCards = { ...stepData.cards };
  existingCards[config.keyPermission] = card;

  // Dispatch action to update Redux store
  store.dispatch(
    setDataCardsStep({
      step: step,
      cards: existingCards,
    })
  );

  // Create item for device
  store.dispatch(
    createItem({
      step: step,
      keyItemPermission: config.keyPermission,
    })
  );

  console.log(
    `✅ [registerDeviceCard] Registered device card: ${config.deviceId}`,
    {
      keyPermission: config.keyPermission,
      step: step,
      assetId: config.assetId,
    }
  );
}

/**
 * Register multiple device cards from config array
 */
export function registerDeviceCards(
  store: Store,
  configs: DeviceCardConfig[]
): void {
  console.log(
    `🔄 [registerDeviceCards] Starting to register ${configs.length} device cards...`
  );
  configs.forEach((config) => {
    registerDeviceCard(store, config);
  });
  console.log(
    `✅ [registerDeviceCards] Successfully registered ${configs.length} device cards`
  );
}

/**
 * Register device cards from JSON config file
 *
 * Usage:
 * import deviceCardsConfig from '../config/deviceCards.json';
 * registerDevicesFromConfig(store, deviceCardsConfig.devices);
 */
export function registerDevicesFromConfig(
  store: Store,
  devices: DeviceCardConfig[]
): void {
  registerDeviceCards(store, devices);
}
