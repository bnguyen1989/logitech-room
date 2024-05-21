import { CardPlatform } from "../../../../components/Cards/CardPlatform/CardPlatform";
import { CardRoom } from "../../../../components/Cards/CardRoom/CardRoom";
import { CardService } from "../../../../components/Cards/CardService/CardService";
import { PrepareSecondaryCard } from "../../../../components/Cards/PrepareSecondaryCard/PrepareSecondaryCard";
import { useAppSelector } from "../../../../hooks/redux";
import {
  getActiveStepData,
  getIsConfiguratorStep,
  getSecondaryCardsFromStep,
  getTitleCardByKeyPermission,
} from "../../../../store/slices/ui/selectors/selectors";
import { CardI, StepI } from "../../../../store/slices/ui/type";
import { StepName } from "../../../../utils/baseUtils";
import s from "./PrepareSection.module.scss";
import {
  Analytics2,
  Event2Types,
  OptionInteractionEvent,
  OptionsShowEvent,
  OptionsType,
} from "@threekit/rest-api";
import { useEffect } from "react";
import { useSession } from "@threekit/react-three-fiber/dist/utilities/analytics.js";
import { ConfigData } from "../../../../utils/threekitUtils";

export const PrepareSection: React.FC = () => {
  const { sessionId } = useSession();
  const activeStepData: StepI = useAppSelector(getActiveStepData);
  const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);
  const secondaryCards = useAppSelector(
    getSecondaryCardsFromStep(activeStepData)
  );

  console.log( "PrepareSection", activeStepData);
  
  const options = 
      Object.values(activeStepData.cards).map((card) => ({
        optionId: card.keyPermission,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        optionName: useAppSelector(
          getTitleCardByKeyPermission(activeStepData.key, card.keyPermission)
        ),
        optionValue: card.keyPermission,
      }));

  // submit event:
  useEffect(() => {
    const auth = {
      host: ConfigData.host,
      orgId: ConfigData.orgId,
      publicToken: ConfigData.publicToken,
    }
    const analytics = new Analytics2(auth);

    const fakeUuid = "00000000-0000-0000-0000-000000000000";

    const optionsShowEvent: OptionsShowEvent = {
      orgId: ConfigData.orgId,
      componentId: fakeUuid,
      sessionId,
      eventType: Event2Types.OptionsShow,
      eventVersion: "1",
      optionsType: OptionsType.Value,
      optionsSetId: activeStepData.key,
      clientTime: new Date().toISOString(),
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      options,
    };
    console.log( "PrepareSection optionsShowEvent", optionsShowEvent);
    analytics.reportEvent(optionsShowEvent);
  }, [activeStepData.key]);

  if (isConfiguratorStep) return null;

  const getCardComponent = (card: CardI, index: number, onSelectedAnalytics: () => void) => {
    const isExistSecondary = secondaryCards.some(
      (item) => item.keyPermission === card.keyPermission
    );
    if (isExistSecondary) return null;

    if (card.key === StepName.Platform) {
      return (
        <CardPlatform key={index} keyItemPermission={card.keyPermission} onSelectedAnalytics={onSelectedAnalytics}/>
      );
    }
    if (card.key === StepName.RoomSize) {
      return <CardRoom key={index} keyItemPermission={card.keyPermission} onSelectedAnalytics={onSelectedAnalytics} />;
    }
    if (card.key === StepName.Services) {
      return <CardService key={index} keyItemPermission={card.keyPermission} onSelectedAnalytics={onSelectedAnalytics} />;
    }
    return null;
  };

  const isSecondaryCards = !!secondaryCards.length;

  return (
    <div className={s.container}>
      <div className={isSecondaryCards ? s.wrapper_scroll : s.wrapper}>
        <div className={s.wrapperCards}>
          <div className={s.content_cards}>
            {Object.values(activeStepData.cards).map((card, index) =>
              getCardComponent(card, index, () => {
                // submit event:
                const auth = {
                  host: ConfigData.host,
                  orgId: ConfigData.orgId,
                  publicToken: ConfigData.publicToken,
                }
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
                  optionsSetId: activeStepData.key,
                  clientTime: new Date().toISOString(),
                };
                analytics.reportEvent(optionInteractionEvent);
              }
            ))}
          </div>
        </div>
        {isSecondaryCards && (
          <div className={s.secondaryWrapper}>
            <div className={s.titleSecond}>
              Not quite what you’re looking for?
            </div>
            <div className={s.secondaryWrapperCards}>
              {secondaryCards.map((card, index) => (
                <PrepareSecondaryCard
                  key={index}
                  keyItemPermission={card.keyPermission}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
