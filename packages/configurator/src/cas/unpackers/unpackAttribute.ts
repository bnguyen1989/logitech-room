import { CasObject } from '@threekit/rest-api';

import { CasAttribute } from '../configurator/attributes.js';
import unpackContentString from './unpackContentString.js';

export default function unpackAttribute(cas: CasObject) {
  const { contentStr } = unpackContentString(cas);
  const attribute: CasAttribute = JSON.parse(contentStr);
  return attribute;
}
