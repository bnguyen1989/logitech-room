import { useEffect, useRef, useState } from "react";
import { ArrowSelectDownSVG } from "../../../../../assets";
import { IconButton } from "../../../../../components/Buttons/IconButton/IconButton";
import { CardSoftware } from "../../../../../components/Cards/CardSoftware/CardSoftware";
import { QuestionForm } from "../../../../../components/QuestionForm/QuestionForm";
import { CardI, QuestionFormI } from "../../../../../store/slices/ui/type";
import s from "./SoftwareServiceSection.module.scss";
import { getExpressionArrayForQuestionForm } from "../../../../../store/slices/ui/utils";
import { SoftwareServicesName } from "../../../../../utils/permissionUtils";
import { FormName, StepName } from "../../../../../utils/baseUtils";
import { useAppSelector } from "../../../../../hooks/redux";
import { getSoftwareServicesLangPage } from "../../../../../store/slices/ui/selectors/selectoteLangPage";
import { useDispatch } from "react-redux";
import { updateDataForm } from "../../../../../store/slices/ui/Ui.slice";
import { getDataSoftwareQuestionsForm } from "../../../../../store/slices/ui/selectors/selectorsForm";
import { optionsShow } from "../../../../../utils/analytics/optionsShow";
import { optionInteraction } from "../../../../../utils/analytics/optionSelect";

interface ExpressionI {
  questionIndex: number;
  optionIndex: number;
}

interface PropsI {
  cards: CardI[];
}
export const SoftwareServiceSection: React.FC<PropsI> = (props) => {
  const { cards } = props;
  const dispatch = useDispatch();
  const formAnchorRef = useRef<HTMLDivElement>(null);
  const [keysNotVisibleCards, setKeysNotVisibleCards] = useState<Array<string>>(
    []
  );

  useEffect(() => {
    optionsShow({
      optionsSetKey: "SoftwareServiceSection",
      options: cards.map((card) => ({
        optionId: card.keyPermission,
        optionName: card.keyPermission,
        optionValue: card.keyPermission,
      })),
    });
  }, []);

  const langPage = useAppSelector(getSoftwareServicesLangPage);

  const dataQuestionForm = useAppSelector(getDataSoftwareQuestionsForm);

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

  const handleClick = () => {
    if (formAnchorRef.current) {
      formAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getCardComponent = (card: CardI, index: number) => {
    const isSoftwareServicesCard = card.key === StepName.SoftwareServices;
    if (!isSoftwareServicesCard) return null;
    if (keysNotVisibleCards.includes(card.keyPermission)) return null;
    return (
      <CardSoftware
        key={index}
        keyItemPermission={card.keyPermission}
        autoActive={!!keysNotVisibleCards.length}  onSelectedAnalytics={()=>
          optionInteraction({
            optionsSetKey: "SoftwareServiceSection",
            optionId: card.keyPermission
        })}
      />
    );
  };

  return (
    <div className={s.container}>
      {!dataQuestionForm.isSubmit ? (
        <div className={s.button_link}>
          <div className={s.actions}>
            <IconButton
              text={langPage.helpButton}
              onClick={handleClick}
              variant={"outlined"}
            >
              <ArrowSelectDownSVG />
            </IconButton>
          </div>
        </div>
      ) : null}
      <div className={s.wrapper_cards}>
        <div className={s.cards}>
          {cards.map((card, index) => getCardComponent(card, index))}
        </div>
      </div>

      {!dataQuestionForm.isSubmit ? (
        <div className={s.form} ref={formAnchorRef}>
          <QuestionForm
            baseData={dataQuestionForm.data}
            submitData={submitFormData}
          />
        </div>
      ) : null}
    </div>
  );
};
