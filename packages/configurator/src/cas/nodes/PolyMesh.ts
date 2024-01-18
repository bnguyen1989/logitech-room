import { z } from 'zod';

import { NODE_TYPE } from '../constants.js';
import { BoxProperty } from '../properties/Box.js';
import { MaterialReferenceProperty } from '../properties/MaterialReference.js';
import { MeshProperty } from '../properties/Mesh.js';
import { PolyMeshPropertiesProperty } from '../properties/PolyMeshProperties.js';
import { SphereProperty } from '../properties/Sphere.js';
import { TransformProperty } from '../properties/Transform.js';
import { PropertyShared } from '../shared.js';

export const PolyMeshNode = PropertyShared.merge(
  z.object({
    type: z.literal(NODE_TYPE.polyMesh),
    plugs: z.object({
      PolyMesh: z.array(
        z.union([
          z.array(BoxProperty),
          z.array(SphereProperty),
          z.array(MeshProperty)
        ])
      ),
      Transform: z.array(TransformProperty),
      Material: z.array(MaterialReferenceProperty),
      Properties: z.array(PolyMeshPropertiesProperty)
    })
  })
);

export type PolyMeshNode = z.infer<typeof PolyMeshNode>;
