import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const PolyMeshPropertiesProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.polyMeshProperties),
    doubleSided: z.boolean(),
    visible: z.boolean(),
    arExportable: z.number(),
    prefetch: z.boolean(),
    layer: z.string(),
    castShadow: z.boolean(),
    receiveShadow: z.boolean(),
    interactive: z.boolean(),
    selectable: z.boolean(),
    walkableInVR: z.boolean(),
    vrayObjectId: z.number(),
    vrayIgnoreLights: z.boolean()
  })
);

export type PolyMeshPropertiesProperty = z.infer<
  typeof PolyMeshPropertiesProperty
>;
