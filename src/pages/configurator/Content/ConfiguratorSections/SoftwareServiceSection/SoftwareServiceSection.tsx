import { ArrowSelectDownSVG } from "../../../../../assets";
import { IconButton } from "../../../../../components/Buttons/IconButton/IconButton";
import { CardSoftware } from "../../../../../components/Cards/CardSoftware/CardSoftware";
import { QuestionForm } from "../../../../../components/QuestionForm/QuestionForm";
import { CardI, StepName } from "../../../../../store/slices/ui/type";
import s from "./SoftwareServiceSection.module.scss";

interface PropsI {
  cards: CardI[];
}
export const SoftwareServiceSection: React.FC<PropsI> = (props) => {
  const { cards } = props;

  const getCardComponent = (card: CardI, index: number) => {
    const isSoftwareServicesCard = card.key === StepName.SoftwareServices;
    if (!isSoftwareServicesCard) return null;
    return <CardSoftware key={index} keyItemPermission={card.keyPermission} />;
  };
  return (
    <div className={s.container}>
      <div className={s.button_link}>
        <div className={s.actions}>
          <IconButton
            text={"Need help? Anchor link"}
            onClick={() => {}}
            variant={"outlined"}
          >
            <ArrowSelectDownSVG />
          </IconButton>
        </div>
      </div>
      <div className={s.cards}>
        {cards.map((card, index) => getCardComponent(card, index))}
      </div>
      <div className={s.form}>
        <QuestionForm />
      </div>
    </div>
  );
};
