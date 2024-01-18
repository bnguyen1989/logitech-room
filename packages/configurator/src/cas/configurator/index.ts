import { z } from 'zod';

import { CasAttribute } from './attributes.js';
import { Metadata } from './metadata.js';
import { Rule } from './rules.js';

export const UnpackedConfigurator = z.object({
  metadata: Metadata,
  attributes: z.array(CasAttribute),
  rules: z.array(Rule)
});

export type UnpackedConfigurator = z.infer<typeof UnpackedConfigurator>;
