import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared, Vector3 } from '../shared.js';

export const TransformProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.transform),
    translation: Vector3,
    rotation: Vector3,
    scale: Vector3,
    shear: Vector3,
    rotateOrder: z.string(),
    preRotation: Vector3,
    rotateAxis: Vector3,
    rotatePivotOffset: Vector3,
    scalePivotOffset: Vector3,
    localRotatePivot: Vector3,
    localScalePivot: Vector3
  })
);

export type TransformProperty = z.infer<typeof TransformProperty>;
