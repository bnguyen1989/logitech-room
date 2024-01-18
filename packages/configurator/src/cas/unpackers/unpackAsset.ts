import type { CasObject } from '@threekit/rest-api';

import type { AssetContentObject } from '../Cas.js';
import type { Node, Scenegraph } from '../nodes/index.js';
import unpackConfigurator from './unpackConfigurator.js';
import unpackContentString from './unpackContentString.js';
import unpackPlugs from './unpackPlugs.js';

function unpackNode(
  node: Omit<AssetContentObject, 'configurator'> & { id: string },
  objects: Record<string, string>
): Node {
  const plugs = unpackPlugs(node.plugs, objects);
  const children = node.children.map((id) => {
    const childNodeStr = objects[id];
    if (!childNodeStr) {
      const errorMsg = `No object found matching the "childNode" id:s ${id}`;
      console.warn(errorMsg);
    }
    const child: AssetContentObject = JSON.parse(childNodeStr);
    return unpackNode({ id, ...child }, objects);
  });
  const unpackdNode = {
    ...node,
    children,
    plugs
  } as Node;
  return unpackdNode;
}

export default function unpackAsset(cas: CasObject): Scenegraph {
  const { objects } = cas;
  const { id, contentStr } = unpackContentString(cas);
  const content: AssetContentObject = JSON.parse(contentStr);
  const asset = unpackNode({ id, ...content }, objects);
  const configurator = unpackConfigurator(content.configurator, objects);
  return { ...asset, configurator };
}
