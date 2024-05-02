import { useRef, useState } from "react";
import { ArrowSelectDownSVG } from "../../../../../assets";
import { IconButton } from "../../../../../components/Buttons/IconButton/IconButton";
import { CardSoftware } from "../../../../../components/Cards/CardSoftware/CardSoftware";
import { QuestionForm } from "../../../../../components/QuestionForm/QuestionForm";
import { CardI, QuestionFormI } from "../../../../../store/slices/ui/type";
import s from "./SoftwareServiceSection.module.scss";
import { getExpressionArrayForQuestionForm } from "../../../../../store/slices/ui/utils";
import { SoftwareServicesName } from "../../../../../utils/permissionUtils";
import { StepName } from "../../../../../utils/baseUtils";
import { useAppSelector } from "../../../../../hooks/redux";
import { getDataQuestionsForm } from "../../../../../store/slices/ui/selectors/selectors";

interface ExpressionI {
  questionIndex: number;
  optionIndex: number;
}

interface PropsI {
  cards: CardI[];
}
export const SoftwareServiceSection: React.FC<PropsI> = (props) => {
  const { cards } = props;
  const formAnchorRef = useRef<HTMLDivElement>(null);
  const [isSubmitForm, setIsSubmitForm] = useState<boolean>(false);
  const [keysNotVisibleCards, setKeysNotVisibleCards] = useState<Array<string>>(
    []
  );

  const dataQuestionForm = useAppSelector(getDataQuestionsForm);

  const submitFormData = (data: Array<QuestionFormI>) => {
    const { select, basic, extendedWarranty } =
      getExpressionArrayForQuestionForm();
    setIsSubmitForm(true);
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
        autoActive={!!keysNotVisibleCards.length}
      />
    );
  };
  return (
    <div className={s.container}>
      <div className={s.button_link}>
        {!isSubmitForm ? (
          <div className={s.actions}>
            <IconButton
              text={"Need help? Anchor link"}
              onClick={handleClick}
              variant={"outlined"}
            >
              <ArrowSelectDownSVG />
            </IconButton>
          </div>
        ) : null}
      </div>
      <div className={s.wrapper_cards}>
        <div className={s.cards}>
          {cards.map((card, index) => getCardComponent(card, index))}
        </div>
      </div>

      {!isSubmitForm ? (
        <div className={s.form} ref={formAnchorRef}>
          <QuestionForm
            baseData={dataQuestionForm}
            submitData={submitFormData}
          />
        </div>
      ) : null}
    </div>
  );
};
