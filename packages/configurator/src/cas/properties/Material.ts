import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { ColorValue, PropertyShared } from '../shared.js';

export const MaterialProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.material),
    baseUV: z.union([z.string(), z.number()]),
    baseColor: z.union([z.number(), ColorValue]),
    baseMapTransparent: z.boolean(),
    renderCategory: z.number(),
    alphaTest: z.boolean(),
    alphaTestMinimum: z.number(),
    depthWrite: z.boolean(),
    depthTest: z.boolean(),
    opacityUV: z.union([z.string(), z.number()]),
    opacityFactor: z.number(),
    invertOpacity: z.boolean(),
    transparencyUV: z.union([z.string(), z.number()]),
    transparencyFactor: z.number(),
    enableTransmission: z.boolean(),
    transmissionUV: z.union([z.string(), z.number()]),
    transmissionFactor: z.number(),
    thicknessUV: z.union([z.string(), z.number()]),
    thicknessFactor: z.number(),
    automaticThickness: z.boolean(),
    attenuationColor: z.union([z.number(), ColorValue]),
    attenuationDistance: z.number(),
    metallicUV: z.union([z.string(), z.number()]),
    metallicFactor: z.number(),
    roughnessUV: z.union([z.string(), z.number()]),
    roughnessFactor: z.number(),
    anisotropyUV: z.union([z.string(), z.number()]),
    anisotropyFactor: z.number(),
    anisotropyRotationUV: z.union([z.string(), z.number()]),
    anisotropyRotationFactor: z.number(),
    anisotropyLabel: z.string(),
    specularUV: z.union([z.string(), z.number()]),
    specularColor: z.union([z.number(), ColorValue]),
    ior: z.number(),
    specularIntensityUV: z.union([z.string(), z.number()]),
    specularIntensityFactor: z.number(),
    multiScatter: z.boolean(),
    thinFilmLutType: z.number(),
    thinFilmThicknessUV: z.union([z.string(), z.number()]),
    thinFilmThicknessFactor: z.number(),
    thinFilmThicknessMin: z.number(),
    clearCoat: z.number(),
    clearCoatRoughness: z.number(),
    clearCoatNormalUV: z.union([z.string(), z.number()]),
    clearCoatNormalFactor: z.number(),
    flakesEnabled: z.boolean(),
    flakesColor: z.union([z.number(), ColorValue]),
    flakesTintUV: z.string(),
    flakesTintColor: z.union([z.number(), ColorValue]),
    flakesUV: z.string(),
    flakesDensity: z.number(),
    flakesSize: z.number(),
    flakesOrientationWarning: z.string(),
    flakesOrientation: z.number(),
    sheenFactor: z.number(),
    sheenEnabled: z.boolean(),
    sheenFactorNew: z.number(),
    sheenUV: z.number(),
    sheenColor: z.union([z.number(), ColorValue]),
    sheenRoughnessUV: z.number(),
    sheenRoughnessFactor: z.number(),
    bumpUV: z.union([z.string(), z.number()]),
    bumpFactor: z.number(),
    normalUV: z.union([z.string(), z.number()]),
    normalFactor: z.number(),
    emissiveUV: z.union([z.string(), z.number()]),
    emissiveColor: z.union([z.number(), ColorValue]),
    emissiveScale: z.number(),
    aoUV: z.union([z.string(), z.number()]),
    aoFactor: z.number(),
    lightUV: z.union([z.string(), z.number()]),
    lightColor: z.union([z.number(), ColorValue]),
    aoMap: z
      .object({
        assetId: z.string().optional(),
        type: z.string().optional()
      })
      .optional(),
    baseMap: z
      .object({
        assetId: z.string().optional(),
        type: z.string().optional()
      })
      .optional(),
    metallicMap: z
      .object({
        assetId: z.string().optional(),
        type: z.string().optional()
      })
      .optional(),
    normalMap: z
      .object({
        assetId: z.string().optional(),
        type: z.string().optional()
      })
      .optional(),
    roughnessMap: z
      .object({
        assetId: z.string().optional(),
        type: z.string().optional()
      })
      .optional(),
    opacityMap: z
      .object({
        assetId: z.string().optional(),
        type: z.string().optional()
      })
      .optional(),
    specularMap: z
      .object({
        assetId: z.string().optional(),
        type: z.string().optional()
      })
      .optional(),
    specularIntensityMap: z
      .object({
        assetId: z.string().optional(),
        type: z.string().optional()
      })
      .optional(),
    bumpMap: z
      .object({
        assetId: z.string().optional(),
        type: z.string().optional()
      })
      .optional(),
    lightMap: z
      .object({
        assetId: z.string().optional(),
        type: z.string().optional()
      })
      .optional(),
    thicknessMap: z
      .object({
        assetId: z.string().optional(),
        type: z.string().optional()
      })
      .optional(),
    transparencyMap: z
      .object({
        assetId: z.string().optional(),
        type: z.string().optional()
      })
      .optional(),
    emissiveMap: z
      .object({
        assetId: z.string().optional(),
        type: z.string().optional()
      })
      .optional()
  })
);

export type MaterialProperty = z.infer<typeof MaterialProperty>;
