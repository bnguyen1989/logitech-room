import { z } from 'zod';

const threekitAuthBase = z.object({
  orgId: z.string().uuid(),
  host: z.string(),
  branch: z.string().optional()
});

export const threekitAuth = z.union([
  z.object({ publicToken: z.string().uuid() }).merge(threekitAuthBase),
  z.object({ privateToken: z.string().uuid() }).merge(threekitAuthBase),
  z.object({ cookie: z.string().uuid() }).merge(threekitAuthBase)
]);
export type ThreekitAuthProps = z.infer<typeof threekitAuth>;
