import { z } from 'zod';

import type { UnpackedConfigurator } from '../configurator/index.js';
import { AnnotationNode } from './Annotation.js';
import { ConnectorNode } from './Connector.js';
import { ImageNode } from './Image.js';
import { ItemNode } from './Item.js';
import { LightNode } from './Light.js';
import { MaterialNode } from './Material.js';
import { MaterialLibraryNode } from './MaterialLibrary.js';
import { ModelNode } from './Model.js';
import { NullNode } from './Null.js';
import { ObjectsNode } from './Objects.js';
import { PolyMeshNode } from './PolyMesh.js';
import { SceneNode } from './Scene.js';

const NodeTypes = z.discriminatedUnion('type', [
  AnnotationNode,
  ConnectorNode,
  ImageNode,
  ItemNode,
  LightNode,
  MaterialNode,
  MaterialLibraryNode,
  ModelNode,
  NullNode,
  ObjectsNode,
  PolyMeshNode,
  SceneNode
]);

export type Node = z.infer<typeof NodeTypes> & {
  children: Node[];
};

export type Scenegraph = Node & {
  configurator?: UnpackedConfigurator;
};

const Node: z.ZodType<Node> = NodeTypes.and(
  z.object({
    children: z.lazy(() => z.array(Node))
  })
);
