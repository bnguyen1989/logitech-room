import { useSession as getSession } from "@threekit/react-three-fiber";
import {
  Analytics2,
  Event2Types,
  StageEvent,
} from "@threekit/rest-api";
import { ConfigData } from "../threekitUtils";

export type StageProp = {
  stageName: string;
};

let lastStageName = ""; // to prevent duplicates.

export const analyticsStage = (props: StageProp) => {
  const { stageName } = props;

  // prevent duplicates
  if( lastStageName === stageName ) return;
  lastStageName = stageName;

  const { sessionId } = getSession();
  const auth =  {
    host: ConfigData.host,
    orgId: ConfigData.orgId,
    publicToken: ConfigData.publicToken,
  };  

  const analytics = new Analytics2(auth);
  
  const fakeUuid = "00000000-0000-0000-0000-000000000000";

  const stageEvent: StageEvent = {
    orgId: auth.orgId,
    componentId: fakeUuid,
    sessionId,
    eventType: Event2Types.Stage,
    eventVersion: "1",
    stageName,
    clientTime: new Date().toISOString(),
    pageUrl: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
  };
  analytics.reportEvent(stageEvent);
};
