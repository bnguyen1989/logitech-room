import { CardSoftware } from "../../../../../components/Cards/CardSoftware/CardSoftware";
import { QuestionForm } from '../../../../../components/QuestionForm/QuestionForm'
import { StepCardType, StepName } from "../../../../../store/slices/ui/type";
import s from "./SoftwareServiceSection.module.scss";

interface PropsI {
  handleClickCard: (card: StepCardType) => void;
  onChangeValueCard: (card: StepCardType, type: "select") => void;
  cards: StepCardType[];
}
export const SoftwareServiceSection: React.FC<PropsI> = (props) => {
  const { handleClickCard, onChangeValueCard, cards } = props;

  const getCardComponent = (card: StepCardType, index: number) => {
    const onClick = () => handleClickCard(card);
    const isSoftwareServicesCard = card.key === StepName.SoftwareServices;
    if (isSoftwareServicesCard) {
      const activeItems = permission.getActiveItems();
      const currentActiveItem = activeItems.find(
        (item) => item.name === card.keyPermission
      );
      return (
        <CardSoftware
          key={index}
          data={card}
          onClick={onClick}
          active={!!currentActiveItem}
          onChange={onChangeValueCard}
        />
      );
    }
    return null;
  };
  return (
    <div className={s.container}>
      <div className={s.cards}>
        {cards.map((card, index) => getCardComponent(card, index))}
      </div>

			<div className={s.form}>
				<QuestionForm />
			</div>
    </div>
  );
};
