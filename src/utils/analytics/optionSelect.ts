import { useSession as getSession } from "@threekit/react-three-fiber";
import {
  Analytics2,
  Event2Types,
  OptionInteractionEvent,
} from "@threekit/rest-api";
import { ConfigData } from "../threekitUtils";

export type OptionInteractionProp = {
  optionId: string;
  optionsSetKey: string;
};
export const optionInteraction = (props: OptionInteractionProp) => {
  const { optionId,optionsSetKey } = props;

  const { sessionId } = getSession();
  const auth =  {
    host: ConfigData.host,
    orgId: ConfigData.orgId,
    publicToken: ConfigData.publicToken,
  };  

  const analytics = new Analytics2(auth);

  const fakeUuid = "00000000-0000-0000-0000-000000000000";

  const optionInteractionEvent: OptionInteractionEvent = {
    orgId: auth.orgId,
    componentId: fakeUuid,
    sessionId,
    eventType: Event2Types.OptionInteraction,
    eventVersion: "1",
    optionId,
    interactionType: "select",
    optionsSetId: optionsSetKey,
    clientTime: new Date().toISOString(),
  };
  analytics.reportEvent(optionInteractionEvent);
};
