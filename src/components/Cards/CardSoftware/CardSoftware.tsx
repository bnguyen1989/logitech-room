import React from "react";
import s from "./CardSoftware.module.scss";
import { CardContainer } from "../CardContainer/CardContainer";
import { ItemCardI, SelectDataI } from "../../../store/slices/ui/type";
import { SelectItem } from "../../Fields/SelectItem/SelectItem";
import { InformationSVG } from "../../../assets";
import { IconButton } from "../../Buttons/IconButton/IconButton";

interface PropsI {
  active?: boolean;
  onClick: () => void;
  data: ItemCardI;
  onChange?: (value: ItemCardI, type: "select") => void;
}
export const CardSoftware: React.FC<PropsI> = (props) => {
  const { onClick, active, data, onChange } = props;

  const handleChangeSelect = (value: SelectDataI) => {
    if (!onChange || !data.select) {
      return;
    }

    onChange({ ...data, select: { ...data.select, value } }, "select");
  };

  return (
    <CardContainer
      onClick={onClick}
      active={active}
      style={{ padding: "0px" }}
    >
      <div className={s.container}>
        <div className={s.content}>
          <div className={s.header} onClick={onClick}>
            <div className={s.header_title}>{data.header_title}</div>
            <div className={s.title}>{data.title}</div>
            {!!data.subtitle && (
              <div className={s.subtitle}>{data.subtitle}</div>
            )}
          </div>
          <div className={s.desc}>{data.description}</div>
          <div className={s.actions}>
            {!!data.select && (
              <SelectItem
                value={data.select.value}
                onSelect={handleChangeSelect}
                options={data.select.data}
                disabled={!active}
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
