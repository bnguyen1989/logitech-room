import { useEffect, useState } from "react";
import { CardSoftware } from "../../../../components/Cards/CardSoftware/CardSoftware";
import { CardI, QuestionFormI, StepI } from "../../../../store/slices/ui/type";
import s from "./SoftwareServiceSection.module.scss";
import { FormName, StepName } from "../../../../utils/baseUtils";
import { useAppSelector } from "../../../../hooks/redux";
import { useDispatch } from "react-redux";
import { updateDataForm } from "../../../../store/slices/ui/Ui.slice";
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
import { getDataSoftwareQuestionsForm } from "../../../../store/slices/ui/selectors/selectorsForm";
import { getExpressionArrayForQuestionForm } from "../../../../store/slices/ui/utils";
import { SoftwareServicesName } from "../../../../utils/permissionUtils";
import { IconButton } from "../../../../components/Buttons/IconButton/IconButton";
import { ArrowSelectDownSVG } from "../../../../assets";
import { getSoftwareServicesLangPage } from "../../../../store/slices/ui/selectors/selectoteLangPage";
import { RoleUserName } from "../../../../utils/userRoleUtils";
import { useUser } from "../../../../hooks/user";

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
  const dispatch = useDispatch();
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
  const dataForm = useAppSelector(getDataSoftwareQuestionsForm);
  const langPage = useAppSelector(getSoftwareServicesLangPage);

  const cards = Object.values(activeStepData.cards);

  const isSoftwareServicesStep =
    activeStepData.key === StepName.SoftwareServices;

  const isUserPartner = user.role.name === RoleUserName.PARTNER;

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
    if (refHeader) {
      refHeader.handleTopAnchor();
    }
  }, [isSoftwareServicesStep]);

  const submitFormData = (data: Array<QuestionFormI>) => {
    const { select, basic, extendedWarranty } =
      getExpressionArrayForQuestionForm();
    setStatusForm(true);
    const dataKeys = [
      SoftwareServicesName.LogitechSync,
      SoftwareServicesName.SupportService,
      SoftwareServicesName.ExtendedWarranty,
    ];
    const visibleKeys = [];
    const isSelect = getResultExpression(data, select);
    if (isSelect) {
      visibleKeys.push(SoftwareServicesName.SupportService);
    }
    const isBasic = getResultExpression(data, basic);
    if (isBasic) {
      visibleKeys.push(SoftwareServicesName.LogitechSync);
    }
    const isExtendedWarranty = getResultExpression(data, extendedWarranty);
    if (isExtendedWarranty) {
      visibleKeys.push(SoftwareServicesName.ExtendedWarranty);
    }
    visibleKeys.forEach((key) => {
      const index = dataKeys.indexOf(key);
      if (index !== -1) {
        dataKeys.splice(index, 1);
      }
    });
    setKeysNotVisibleCards(dataKeys);
  };

  const getResultExpression = (
    data: Array<QuestionFormI>,
    expression: Array<Array<ExpressionI>>
  ) => {
    const result = expression.map((item) => {
      return item.some((expressionItem) => {
        const { questionIndex, optionIndex } = expressionItem;
        const question = data[questionIndex - 1];
        return question.options[optionIndex - 1].value;
      });
    });
    return result.every((item) => item);
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
          <SubSectionCardSoftware
            name={"Add additional warranty"}
            parentKeyPermission={card.keyPermission}
            keyPermissionCards={subKeyPermissions}
          />
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
        {!dataForm.isSubmit ? (
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

        {!isUserPartner && !dataForm.isSubmit && (
          <QuestionForm baseData={dataForm.data} submitData={submitFormData} />
        )}

        <div
          ref={!isUserPartner ? bottomContentAnchor.ref : undefined}
          className={s.cards}
        >
          {cardsSoftwareServices.map((card, index) =>
            getCardComponent(card, index)
          )}
        </div>

        {isUserPartner && !dataForm.isSubmit && (
          <div ref={bottomContentAnchor.ref}>
            <QuestionForm
              baseData={dataForm.data}
              submitData={submitFormData}
            />
          </div>
        )}
      </div>
    </ContentContainer>
  );
};
