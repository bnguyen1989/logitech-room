import { Analytics2, Event2Types, OptionInteractionEvent, OptionsShowEvent, OptionsType, ThreekitAuthProps } from "@threekit/rest-api";
import { CardI } from "../../store/slices/ui/type";

export type OptionInteractionProp = {
    auth: ThreekitAuthProps;
    card: CardI;
    optionsSetKey: string;
    sessionId: string;
    ConfigData: any;
}
export const optionInteraction = ( props: OptionInteractionProp ) =>  {
    const { auth, card, sessionId, optionsSetKey, ConfigData } = props;
    
    const analytics = new Analytics2(auth);

    const fakeUuid = "00000000-0000-0000-0000-000000000000";

    const optionInteractionEvent: OptionInteractionEvent = {
      orgId: ConfigData.orgId,
      componentId: fakeUuid,
      sessionId,
      eventType: Event2Types.OptionInteraction,
      eventVersion: "1",
      optionId: card.keyPermission,
      interactionType: "select",
      optionsSetId: optionsSetKey,
      clientTime: new Date().toISOString(),
    };
    analytics.reportEvent(optionInteractionEvent);
  }