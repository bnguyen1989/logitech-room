import React from "react";
import s from "./Footer.module.scss";
import { Actions } from "../Actions/Actions";

export const Footer: React.FC = () => {
  return (
    <div className={s.container}>
      <div className={s.divider}></div>
      <div className={s.title}>Price set by reseller</div>
      <div className={s.subtitle}>
        * Prices listed are based on product MSRPs. Contact your local reseller
        or Logitech Sales representative for more information.
      </div>
      <div className={s.divider}></div>
      <div className={s.buttons}>
        <Actions />
      </div>
    </div>
  );
};
