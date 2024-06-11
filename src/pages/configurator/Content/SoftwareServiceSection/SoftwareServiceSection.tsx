import { useEffect } from "react";
import { CardSoftware } from "../../../../components/Cards/CardSoftware/CardSoftware";
import { CardI, StepI } from "../../../../store/slices/ui/type";
import s from "./SoftwareServiceSection.module.scss";
import { FormName, StepName } from "../../../../utils/baseUtils";
import { useAppSelector } from "../../../../hooks/redux";
import { useDispatch } from "react-redux";
import { updateDataForm } from "../../../../store/slices/ui/Ui.slice";
import { getTKAnalytics } from "../../../../utils/getTKAnalytics";
import { OptionInteractionType, OptionsType } from "@threekit/rest-api";
import { getActiveStepData } from "../../../../store/slices/ui/selectors/selectors";
import { ContentContainer } from "../ContentContainer/ContentContainer";
import { useAnchor } from "../../../../hooks/anchor";

export const SoftwareServiceSection: React.FC = () => {
  const dispatch = useDispatch();
  const actionAnchor = useAnchor<HTMLDivElement>();

  const activeStepData: StepI = useAppSelector(getActiveStepData);

  const cards = Object.values(activeStepData.cards);

  const isSoftwareServicesStep =
    activeStepData.key === StepName.SoftwareServices;

  const setStatusForm = (value: boolean) => {
    dispatch(
      updateDataForm({
        key: FormName.QuestionFormSoftware,
        value: {
          isSubmit: value,
        },
      })
    );
  };

  useEffect(() => {
    return () => setStatusForm(false);
  }, []);

  useEffect(() => {
    if (!isSoftwareServicesStep) {
      setStatusForm(false);
    }
  }, [isSoftwareServicesStep]);

  useEffect(() => {
    if (!isSoftwareServicesStep) return;
    getTKAnalytics().optionsShow({
      optionsSetId: "SoftwareServiceSection",
      optionsType: OptionsType.Value,
      options: cards.map((card) => ({
        optionId: card.keyPermission,
        optionName: card.keyPermission,
        optionValue: card.keyPermission,
      })),
    });
  }, [isSoftwareServicesStep]);

  const getCardComponent = (card: CardI, index: number) => {
    const isSoftwareServicesCard = card.key === StepName.SoftwareServices;
    if (!isSoftwareServicesCard) return null;
    return (
      <CardSoftware
        key={index}
        keyItemPermission={card.keyPermission}
        onSelectedAnalytics={() =>
          getTKAnalytics().optionInteraction({
            optionsSetId: "SoftwareServiceSection",
            optionId: card.keyPermission,
            interactionType: OptionInteractionType.Select,
          })
        }
        onClick={actionAnchor.handleAnchor}
      />
    );
  };

  if (!isSoftwareServicesStep) return null;

  return (
    <ContentContainer refAction={actionAnchor.ref}>
      <div className={s.container}>
        <div className={s.wrapper_cards}>
          <div className={s.cards}>
            {cards.map((card, index) => getCardComponent(card, index))}
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};
