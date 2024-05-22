import { useSession as getSession } from "@threekit/react-three-fiber";
import {
  Analytics2,
  Event2Types,
  CustomEvent,
} from "@threekit/rest-api";
import { ConfigData } from "../threekitUtils";

export type CustomProp = {
  customName: string;
};


export const analyticsCustom = (props: CustomProp) => {
  const { customName } = props;


  const { sessionId } = getSession();
  const auth =  {
    host: ConfigData.host,
    orgId: ConfigData.orgId,
    publicToken: ConfigData.publicToken,
  };  

  const analytics = new Analytics2(auth);

  const fakeUuid = "00000000-0000-0000-0000-000000000000";

  const customEvent: CustomEvent = {
    orgId: auth.orgId,
    componentId: fakeUuid,
    sessionId,
    assetId: fakeUuid,
    eventType: Event2Types.Custom,
    eventVersion: "1",
    clientTime: new Date().toISOString(),
    customName
  };
  analytics.reportEvent(customEvent);
};
