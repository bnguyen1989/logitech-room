import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const DefaultPropertiesProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.default),
    selectable: z.boolean(),
    arExportable: z.number(),
    visible: z.boolean()
  })
);

export type DefaultPropertiesProperty = z.infer<
  typeof DefaultPropertiesProperty
>;
