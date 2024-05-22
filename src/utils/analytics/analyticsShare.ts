import { useSession as getSession } from "@threekit/react-three-fiber";
import {
  Analytics2,
  Event2Types,
  ShareEvent,
} from "@threekit/rest-api";
import { ConfigData } from "../threekitUtils";

export type ShareProp = {
  shareLink: string;
};


export const analyticsShare = (props: ShareProp) => {
  const { shareLink } = props;


  const { sessionId } = getSession();
  const auth =  {
    host: ConfigData.host,
    orgId: ConfigData.orgId,
    publicToken: ConfigData.publicToken,
  };  

  const analytics = new Analytics2(auth);
  
  const fakeUuid = "00000000-0000-0000-0000-000000000000";

  const shareEvent: ShareEvent = {
    orgId: auth.orgId,
    componentId: fakeUuid,
    sessionId,
    assetId: fakeUuid,
    eventType: Event2Types.Share,
    eventVersion: "1",
    clientTime: new Date().toISOString(),
    shareType: 'create',
    shareLink
  };
  analytics.reportEvent(shareEvent);
};
