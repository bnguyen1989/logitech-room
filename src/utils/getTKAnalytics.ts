import { useSession as getSession2 } from "@threekit/react-three-fiber";

import { type Session, getSession } from "@threekit/analytics";
import { ConfigData } from "./threekitUtils";

export const getTKAnalytics = (): Session => {
  return getSession({
    auth: {
      host: ConfigData.host,
      orgId: ConfigData.orgId,
      publicToken: ConfigData.publicToken,
    },
    sessionId: getSession2().sessionId,
  });
};
