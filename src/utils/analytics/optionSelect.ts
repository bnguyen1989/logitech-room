import {
  Analytics2,
  Event2Types,
  OptionInteractionEvent,
  ThreekitAuthProps,
} from "@threekit/rest-api";

export type OptionInteractionProp = {
  auth: ThreekitAuthProps;
  optionId: string;
  optionsSetKey: string;
  sessionId: string;
};
export const optionInteraction = (props: OptionInteractionProp) => {
  const { auth, optionId, sessionId, optionsSetKey } = props;

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
