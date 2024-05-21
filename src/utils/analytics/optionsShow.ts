import { Analytics2, Event2Types, OptionsShowEvent, OptionsType, ThreekitAuthProps } from "@threekit/rest-api";
import { CardI } from "../../store/slices/ui/type";

export type OptionsShowProp = {
    auth: ThreekitAuthProps;
    cards: Record<string,CardI>;
    optionsSetKey: string;
    sessionId: string;
    ConfigData: any;
}
export const optionsShow = ( props: OptionsShowProp ) => {
    const { auth, cards, sessionId, optionsSetKey, ConfigData } = props;
    
        const options = 
        Object.values(cards).map((card) => ({
          optionId: card.keyPermission,
          // eslint-disable-next-line react-hooks/rules-of-hooks
          optionName: card.keyPermission,
          optionValue: card.keyPermission,
        }));
        console.log( "PrepareSection options", options);
    
        if( options.length === 0) return;
    
    
    
        const analytics = new Analytics2(auth);
    
        const fakeUuid = "00000000-0000-0000-0000-000000000000";
    
        const optionsShowEvent: OptionsShowEvent = {
          orgId: ConfigData.orgId,
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
        console.log( "PrepareSection optionsShowEvent", optionsShowEvent);
        analytics.reportEvent(optionsShowEvent);
}