import React, { useEffect } from "react";
import s from "./CardSoftware.module.scss";
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
import { getPrepareDescriptionLangByKeyPermission } from "../../../store/slices/ui/selectors/selectoteLangPage";
import { CardContainerSoftware } from "../CardContainerSoftware/CardContainerSoftware";

interface PropsI {
  keyItemPermission: string;
  autoActive?: boolean;
  onSelectedAnalytics: () => void;
  onClick?: () => void;
}
export const CardSoftware: React.FC<PropsI> = (props) => {
  const { keyItemPermission, autoActive, onClick } = props;
  const activeStep = useAppSelector(getActiveStep);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  const threekitAsset = useAppSelector(getAssetFromCard(card));
  const title = useAppSelector(
    getTitleCardByKeyPermission(activeStep, keyItemPermission)
  );
  const description = useAppSelector(
    getPrepareDescriptionLangByKeyPermission(keyItemPermission)
  );
  const isActiveCard = useAppSelector(
    getIsSelectedCardByKeyPermission(activeStep, keyItemPermission)
  );

  const handleClick = () => {
    props.onSelectedAnalytics();

    const { attributeName } = card.dataThreekit;
    const isIncludeSelect = card.select;

    if (isActiveCard && card.keyPermission) {
      app.removeItem(attributeName, card.keyPermission);
      if (isIncludeSelect) {
        app.changeSelectItemConfiguration(
          attributeName,
          "",
          card.keyPermission
        );
      }
      return;
    }

    if (isIncludeSelect) {
      app.changeSelectItemConfiguration(
        attributeName,
        threekitAsset.id,
        card.keyPermission
      );
    } else {
      app.addItemConfiguration(
        attributeName,
        threekitAsset.id,
        card.keyPermission
      );
    }

    onClick && onClick();
  };

  useEffect(() => {
    if (isActiveCard) return;
    if (autoActive) handleClick();
  }, [autoActive]);

  if (!card) return null;

  return (
    <CardContainerSoftware
      onClick={handleClick}
      active={isActiveCard}
      style={{ padding: "0px" }}
    >
      <div className={s.container}>
        <div className={s.wrapper}>
          <div className={s.content}>
            <div className={s.header} onClick={handleClick}>
              {/* <div className={s.header_title}>{card.header_title}</div> */}
              <div className={s.title}>{title}</div>
              {!!card.subtitle && (
                <div className={s.subtitle}>{card.subtitle}</div>
              )}
            </div>
            <div className={s.desc}>{description}</div>
          </div>
          {!!card.select && (
            <div className={s.actions}>
              <SelectItem
                keyItemPermission={keyItemPermission}
                defaultLabel={"Choose Lorem Plan"}
              />
            </div>
          )}
          <div className={s.info_mobile}>
            <div className={s.info_button_mobile}>INFO</div>
          </div>
        </div>
        <div className={s.info}>
          <IconButton onClick={() => {}}>
            <InformationSVG />
          </IconButton>
        </div>
      </div>
    </CardContainerSoftware>
  );
};
