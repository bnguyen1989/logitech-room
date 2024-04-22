import React from "react";
import s from "./Header.module.scss";
import { Actions } from "../Actions/Actions";

interface PropsI {
  title: string;
}
export const Header: React.FC<PropsI> = (props) => {
  const { title } = props;

  return (
    <div className={s.container}>
      <div className={s.text}>
        <div className={s.title}>{title}</div>
        <div className={s.subtitle}>
          Configurations are for exploratory purposes only. Room guides and the
          prices listed are based on local MSRP for the products and are not
          formal quotes. Prices may vary by location, channel or reseller.
          Please <u>request a consultation</u> for more information and next steps.
        </div>
      </div>
      <div className={s.buttons}>
        <Actions />
      </div>
    </div>
  );
};
