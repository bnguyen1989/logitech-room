import { z } from 'zod';

import { NODE_TYPE } from '../constants.js';
import { ImageProperty } from '../properties/Image.js';
import { ImagePropertiesProperty } from '../properties/ImageProperties.js';
import { NodeShared } from '../shared.js';

export const ImageNode = NodeShared.merge(
  z.object({
    type: z.literal(NODE_TYPE.image),
    plugs: z
      .object({
        Image: z.array(ImageProperty),
        Properties: z.array(ImagePropertiesProperty)
      })
      .required()
  })
);

export type ImageNode = z.infer<typeof ImageNode>;
