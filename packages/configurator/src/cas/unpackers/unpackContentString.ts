import type { CasObject } from '@threekit/rest-api';

import { AssetObject, RootObject } from '../Cas.js';

export default function unpackContentString(cas: CasObject) {
  const { objects, HEAD } = cas;
  const head: AssetObject = JSON.parse(objects[HEAD]);
  const root: RootObject = JSON.parse(objects[head.root]);
  return { id: head.id, contentStr: objects[root.content] };
}
