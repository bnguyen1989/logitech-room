import React from "react";
import s from "./Header.module.scss";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { EditSVG } from "../../../assets";
import { Actions } from "../Actions/Actions";

interface PropsI {
  title: string;
}
export const Header: React.FC<PropsI> = (props) => {
  const { title } = props;

  return (
    <div className={s.container}>
      <div className={s.title}>
        <div className={s.text}>{title}</div>
        <IconButton onClick={() => {}}>
          <EditSVG />
        </IconButton>
      </div>
      <div className={s.buttons}>
        <Actions />
      </div>
    </div>
  );
};
