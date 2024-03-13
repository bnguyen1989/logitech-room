import React from "react";
import s from "./CardSoftware.module.scss";
import { CardContainer } from "../CardContainer/CardContainer";
import { SelectItem } from "../../Fields/SelectItem/SelectItem";
import { InformationSVG } from "../../../assets";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getCardByKeyPermission,
  getIsSelectedCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";

interface PropsI {
  keyItemPermission: string;
  onClick: () => void;
}
export const CardSoftware: React.FC<PropsI> = (props) => {
  const { onClick, keyItemPermission } = props;
  const activeStep = useAppSelector(getActiveStep);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  const isActiveCard = useAppSelector(
    getIsSelectedCardByKeyPermission(activeStep, keyItemPermission)
  );

  if (!card) return null;

  return (
    <CardContainer
      onClick={onClick}
      active={isActiveCard}
      style={{ padding: "0px" }}
    >
      <div className={s.container}>
        <div className={s.content}>
          <div className={s.header} onClick={onClick}>
            {/* <div className={s.header_title}>{card.header_title}</div> */}
            {/* <div className={s.title}>{card.title}</div> */}
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
