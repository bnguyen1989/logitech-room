import {
  Analytics2,
  Event2Types,
  OptionsShowEvent,
  OptionsType,
  ThreekitAuthProps,
  ValueOption,
} from "@threekit/rest-api";
import { useSession as getSession } from "@threekit/react-three-fiber";
import { ConfigData } from "../threekitUtils";

export type OptionsShowProp = {
  options: ValueOption[];
  optionsSetKey: string;
};

export const optionsShow = (props: OptionsShowProp) => {
  const {  options,optionsSetKey } = props;

  if (options.length === 0) return;

  const { sessionId } = getSession();
  const auth: ThreekitAuthProps =  {
    host: ConfigData.host,
    orgId: ConfigData.orgId,
    publicToken: ConfigData.publicToken,
  };  

  const analytics = new Analytics2(auth);
  const fakeUuid = "00000000-0000-0000-0000-000000000000";

  const optionsShowEvent: OptionsShowEvent = {
    orgId: auth.orgId,
    componentId: fakeUuid,
    sessionId,
    eventType: Event2Types.OptionsShow,
    eventVersion: "1",
    optionsType: OptionsType.Value,
    optionsSetId: optionsSetKey,
    clientTime: new Date().toISOString(),
    pageUrl: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    options,
  };
  analytics.reportEvent(optionsShowEvent);
};
