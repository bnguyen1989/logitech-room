import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const TilingOverrideProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.tilingOverride),
    uOffset: z.number(),
    vOffset: z.number(),
    uTile: z.number(),
    vTile: z.number(),
    scaleMode: z.number(),
    uScale: z.number(),
    vScale: z.number(),
    anisotropyMap: z.boolean(),
    aoMap: z.boolean(),
    baseMap: z.boolean(),
    bumpMap: z.boolean(),
    clearCoatNormalMap: z.boolean(),
    flakesTintMap: z.boolean(),
    flakesMap: z.boolean(),
    sheenMap: z.boolean(),
    sheenRoughnessMap: z.boolean(),
    emissiveMap: z.boolean(),
    lightMap: z.boolean(),
    metallicMap: z.boolean(),
    normalMap: z.boolean(),
    opacityMap: z.boolean(),
    roughnessMap: z.boolean(),
    specularMap: z.boolean(),
    specularIntensityMap: z.boolean(),
    transparencyMap: z.boolean(),
    transmissionMap: z.boolean(),
    thicknessMap: z.boolean(),
    thinFilmThicknessMap: z.boolean()
  })
);

export type TilingOverrideProperty = z.infer<typeof TilingOverrideProperty>;
