import React from "react";
import s from "./LoaderSection.module.scss";
import { Loader } from "../../../../components/Loader/Loader";
import { useAppSelector } from "../../../../hooks/redux";
import { getSelectedPrepareCards } from "../../../../store/slices/ui/selectors/selectors";
import { Card } from "./Card/Card";

interface PropsI {
  cardShow?: boolean;
  text?: string;
}
export const LoaderSection: React.FC<PropsI> = (props) => {
  const { cardShow = true, text = "Building Your Room" } = props;
  const selectedCards = useAppSelector(getSelectedPrepareCards);

  return (
    <div className={s.container}>
      <Loader text={text} />

      {cardShow && (
        <div className={s.selected_cards}>
          <div className={s.text}>
            <div className={s.divider}></div>
            <div className={s.title}>You Selected:</div>
            <div className={s.divider}></div>
          </div>
          <div className={s.cards}>
            {selectedCards.map((card, index) => (
              <Card key={index} image={card.image} title={card.title} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
