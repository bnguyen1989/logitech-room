import React from "react";
import s from "./LoaderSection.module.scss";
import { Loader } from "../../../../components/Loader/Loader";
import { useAppSelector } from "../../../../hooks/redux";
import {
  getActiveStep,
  getIsProcessInitData,
  getSelectedPrepareCards,
} from "../../../../store/slices/ui/selectors/selectors";
import { Card } from "./Card/Card";
import { getIsBuilding } from "../../../../store/slices/configurator/selectors/selectors";

export const LoaderSection: React.FC = () => {
  const selectedCards = useAppSelector(getSelectedPrepareCards);

  const activeStep = useAppSelector(getActiveStep);
  const isBuilding = useAppSelector(getIsBuilding);
  const isProcessInitData = useAppSelector(getIsProcessInitData);

  const isConferenceCamera = activeStep?.name
    .toLocaleLowerCase()
    .includes("conference camera");

  if (isBuilding && isConferenceCamera)
    return (
      <div className={s.loader}>
        <div className={s.container}>
          <Loader text="Building Your Room" />

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
        </div>
      </div>
    );

    if(isProcessInitData) {
      return (
        <div className={s.loader}>
          <div className={s.container_simple}>
            <Loader text="Loading Your Room" />
          </div>
        </div>
      );
    }

  return <></>;
};
