import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const ConnectorProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.connector),
    targets: z.array(z.string()),
    strictRotation: z.boolean(),
    snappingAngle: z.number()
  })
);

export type ConnectorProperty = z.infer<typeof ConnectorProperty>;
