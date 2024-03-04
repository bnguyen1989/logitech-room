import React from "react";
import s from "./Footer.module.scss";
import { Actions } from "../Actions/Actions";

export const Footer: React.FC = () => {
  return (
    <div className={s.container}>
      <div className={s.divider}></div>
      <div className={s.title}>Prices may vary by channel or reseller</div>
      <div className={s.subtitle}>
        *Prices listed are based on product MSRPs. Contact you local reseller or
        a Logitech Sales Representative for more information.
      </div>
      <div className={s.divider}></div>
      <div className={s.buttons}>
        <Actions />
      </div>
    </div>
  );
};
