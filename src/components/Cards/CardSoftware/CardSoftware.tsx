import React from "react";
import s from "./CardSoftware.module.scss";
import { CardContainer } from "../CardContainer/CardContainer";
import { SelectItem } from "../../Fields/SelectItem/SelectItem";
import { InformationSVG } from "../../../assets";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getAssetFromCard,
  getCardByKeyPermission,
  getIsSelectedCardByKeyPermission,
  getTitleCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";

interface PropsI {
  keyItemPermission: string;
}
export const CardSoftware: React.FC<PropsI> = (props) => {
  const { keyItemPermission } = props;
  const activeStep = useAppSelector(getActiveStep);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  const threekitAsset = useAppSelector(getAssetFromCard(card));
  const title = useAppSelector(
    getTitleCardByKeyPermission(activeStep, keyItemPermission)
  );
  const isActiveCard = useAppSelector(
    getIsSelectedCardByKeyPermission(activeStep, keyItemPermission)
  );

  const handleClick = () => {
    const { attributeName } = card.dataThreekit;
    if (isActiveCard && card.keyPermission) {
      app.removeItem(attributeName, card.keyPermission);
      return;
    }

    app.addItemConfiguration(
      attributeName,
      threekitAsset.id,
      card.keyPermission
    );
  };

  if (!card) return null;

  return (
    <CardContainer
      onClick={handleClick}
      active={isActiveCard}
      style={{ padding: "0px" }}
    >
      <div className={s.container}>
        <div className={s.content}>
          <div className={s.header} onClick={handleClick}>
            {/* <div className={s.header_title}>{card.header_title}</div> */}
            <div className={s.title}>{title}</div>
            {!!card.subtitle && (
              <div className={s.subtitle}>{card.subtitle}</div>
            )}
          </div>
          <div className={s.desc}>{card.description}</div>
          <div className={s.actions}>
            {!!card.select && (
              <SelectItem
                keyItemPermission={keyItemPermission}
                disabled={!isActiveCard}
              />
            )}
          </div>
        </div>

        <div className={s.info}>
          <IconButton onClick={() => {}}>
            <InformationSVG />
          </IconButton>
        </div>
      </div>
    </CardContainer>
  );
};
