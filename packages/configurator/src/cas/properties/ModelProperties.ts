import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const ModelPropertiesProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.modelProperties),
    arExportable: z.number(),
    configurator: z.string(),
    overrideChildSelection: z.boolean(),
    renderable: z.boolean(),
    selectable: z.boolean(),
    visible: z.boolean()
  })
);

export type ModelPropertiesProperty = z.infer<typeof ModelPropertiesProperty>;
