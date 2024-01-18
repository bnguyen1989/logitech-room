import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const ImageProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.image),
    uOffset: z.number(),
    vOffset: z.number(),
    uTile: z.number(),
    vTile: z.number(),
    scaleMode: z.number(),
    uScale: z.number(),
    vScale: z.number(),
    rotation: z.number(),
    invert: z.boolean(),
    gainPivot: z.number(),
    gain: z.number(),
    brightness: z.number(),
    redGreenLabel: z.string(),
    redFlip: z.boolean(),
    greenFlip: z.boolean(),
    swapRG: z.boolean(),
    magFilter: z.number(),
    minFilter: z.number(),
    generateMipMaps: z.boolean(),
    wrapU: z.number(),
    wrapV: z.number(),
    width: z.number(),
    height: z.number(),
    originalWidth: z.number(),
    originalHeight: z.number(),
    webglSize: z.number(),
    arSize: z.number(),
    vraySize: z.number(),
    originalBitmapFile: z
      .object({
        hash: z.string(),
        filename: z.string(),
        type: z.string()
      })
      .nullable(),
    glBitmapFile: z
      .object({
        filename: z.string(),
        hash: z.string(),
        type: z.string()
      })
      .nullable(),
    rendererBitmapFile: z
      .object({
        filename: z.string(),
        hash: z.string(),
        type: z.string()
      })
      .nullable(),
    hdrBitmapFile: z
      .object({
        filename: z.string(),
        hash: z.string(),
        type: z.string()
      })
      .nullable()
  })
);

export type ImageProperty = z.infer<typeof ImageProperty>;
