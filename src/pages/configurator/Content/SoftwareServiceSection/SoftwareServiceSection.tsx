import { useEffect, useState } from "react";
import { CardSoftware } from "../../../../components/Cards/CardSoftware/CardSoftware";
import { CardI, QuestionFormI, StepI } from "../../../../store/slices/ui/type";
import s from "./SoftwareServiceSection.module.scss";
import { StepName } from "../../../../utils/baseUtils";
import { useAppSelector } from "../../../../hooks/redux";
import { getTKAnalytics } from "../../../../utils/getTKAnalytics";
import { OptionInteractionType, OptionsType } from "@threekit/rest-api";
import {
  getActiveStepData,
  getSubCardsKeyPermissionStep,
} from "../../../../store/slices/ui/selectors/selectors";
import { ContentContainer } from "../ContentContainer/ContentContainer";
import { useAnchor } from "../../../../hooks/anchor";
import { SubSectionCardSoftware } from "./SubSectionCardSoftware/SubSectionCardSoftware";
import { QuestionForm } from "../../../../components/QuestionForm/QuestionForm";
import { getExpressionArrayForQuestionForm } from "../../../../store/slices/ui/utils";
import { SoftwareServicesName } from "../../../../utils/permissionUtils";
import { IconButton } from "../../../../components/Buttons/IconButton/IconButton";
import { ArrowSelectDownSVG } from "../../../../assets";
import { getSoftwareServicesLangPage } from "../../../../store/slices/ui/selectors/selectoteLangPage";
import { RoleUserName } from "../../../../utils/userRoleUtils";
import { useUser } from "../../../../hooks/user";
import { useQuestionForm } from "../../../../hooks/questionForm";

interface ExpressionI {
  questionIndex: number;
  optionIndex: number;
}
interface SoftwareServiceSectionIn {
  refHeader?: any;
}
export const SoftwareServiceSection: React.FC<SoftwareServiceSectionIn> = ({
  refHeader,
}) => {
  const user = useUser();
  const [keysNotVisibleCards, setKeysNotVisibleCards] = useState<Array<string>>(
    []
  );

  const actionAnchor = useAnchor<HTMLDivElement>();
  const bottomContentAnchor = useAnchor<HTMLDivElement>();

  const activeStepData: StepI = useAppSelector(getActiveStepData);
  const subCardKeyPermissions = useAppSelector(
    getSubCardsKeyPermissionStep(activeStepData)
  );
  const questionForm = useQuestionForm();
  const langPage = useAppSelector(getSoftwareServicesLangPage);

  const cards = Object.values(activeStepData.cards);

  const isSoftwareServicesStep =
    activeStepData.key === StepName.SoftwareServices;

  const isUserPartner = user.role.name === RoleUserName.PARTNER;

  useEffect(() => {
    return () => questionForm.setStatusForm(false);
  }, []);

  useEffect(() => {
    if (!questionForm.data.isSubmit) {
      setKeysNotVisibleCards([]);
    }
  }, [questionForm.data.isSubmit]);

  useEffect(() => {
    if (!isSoftwareServicesStep) {
      questionForm.setStatusForm(false);
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
    if (refHeader) {
      refHeader.handleTopAnchor();
    }
  }, [isSoftwareServicesStep]);

  const submitFormData = (data: Array<QuestionFormI>) => {
    const expressionArray = getExpressionArrayForQuestionForm();
    questionForm.setStatusForm(true);
    const keysPriority = {
      [SoftwareServicesName.LogitechSync]: 3,
      [SoftwareServicesName.SupportService]: 1,
      [SoftwareServicesName.ExtendedWarranty]: 3,
      [SoftwareServicesName.EssentialServicePlan]: 2,
    };
    const dataKeys = Object.keys(keysPriority) as SoftwareServicesName[];
    const visibleKeys: SoftwareServicesName[] = [];
    const weightByQuestionForm: Record<string, number> = dataKeys.reduce(
      (acc, key) => {
        const weightByQuestionForm = getResultWeightExpression(
          data,
          expressionArray[key]
        );

        if (weightByQuestionForm === 0) {
          return acc;
        }
        return {
          ...acc,
          [key]: getResultWeightExpression(data, expressionArray[key]),
        };
      },
      {}
    );

    const keys = Object.keys(weightByQuestionForm) as SoftwareServicesName[];
    if (keys.length === 1) {
      visibleKeys.push(keys[0]);
    }

    if (keys.length > 1) {
      const maxWeight = Math.max(...Object.values(weightByQuestionForm));
      const maxWeightKeys = keys.filter(
        (key) => weightByQuestionForm[key] === maxWeight
      );

      const maxWeightKeysPriority = maxWeightKeys.reduce((acc, key) => {
        return keysPriority[key] < keysPriority[acc] ? key : acc;
      }, maxWeightKeys[0]);

      visibleKeys.push(maxWeightKeysPriority);
    }

    visibleKeys.forEach((key) => {
      const index = dataKeys.indexOf(key);
      if (index !== -1) {
        dataKeys.splice(index, 1);
      }
    });
    setKeysNotVisibleCards(dataKeys);
  };

  const getResultWeightExpression = (
    data: Array<QuestionFormI>,
    expression: Array<Array<ExpressionI>>
  ) => {
    return expression.reduce((acc, current) => {
      const isExist = current.some((expressionItem) => {
        const { questionIndex, optionIndex } = expressionItem;
        const question = data[questionIndex - 1];
        return question.options[optionIndex - 1].value;
      });

      if (isExist) acc += 1;

      return acc;
    }, 0);
  };

  const getCardComponent = (card: CardI, index: number) => {
    if (keysNotVisibleCards.includes(card.keyPermission)) return null;
    const isSubSection = Object.values(subCardKeyPermissions)
      .flat()
      .includes(card.keyPermission);
    if (isSubSection) return null;
    const subKeyPermissions = subCardKeyPermissions[card.keyPermission];
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
        onClick={actionAnchor.handleBottomAnchor}
      >
        {subKeyPermissions.length > 0 && (
          <SubSectionCardSoftware keyPermissionCards={subKeyPermissions} />
        )}
      </CardSoftware>
    );
  };

  if (!isSoftwareServicesStep) return null;

  const cardsSoftwareServices = cards.filter(
    (card) => card.key === StepName.SoftwareServices
  );

  return (
    <ContentContainer refAction={actionAnchor.ref}>
      <div className={s.container}>
        {!questionForm.data.isSubmit ? (
          <div className={s.button_link}>
            <div className={s.actions}>
              <IconButton
                text={
                  isUserPartner
                    ? langPage.buttons.needHelp
                    : langPage.buttons.alreadyKnow
                }
                onClick={bottomContentAnchor.handleBottomAnchor}
                variant={"outlined"}
              >
                <ArrowSelectDownSVG />
              </IconButton>
            </div>
          </div>
        ) : null}

        {!isUserPartner && !questionForm.data.isSubmit && (
          <div>
            <QuestionForm
              baseData={questionForm.data.data}
              submitData={submitFormData}
            />
          </div>
        )}

        <div
          ref={!isUserPartner ? bottomContentAnchor.ref : undefined}
          className={s.cards}
        >
          {cardsSoftwareServices.map((card, index) =>
            getCardComponent(card, index)
          )}
        </div>

        {isUserPartner && !questionForm.data.isSubmit && (
          <div ref={bottomContentAnchor.ref}>
            <QuestionForm
              baseData={questionForm.data.data}
              submitData={submitFormData}
            />
          </div>
        )}
      </div>
    </ContentContainer>
  );
};
