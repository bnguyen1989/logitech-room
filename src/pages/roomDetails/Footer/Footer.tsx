import React from "react";
import s from "./Footer.module.scss";
import { Actions } from "../Actions/Actions";

interface PropsI {
  totalAmount?: string;
}
export const Footer: React.FC<PropsI> = (props) => {
  const { totalAmount } = props;
  return (
    <div className={s.container}>
      <div className={s.desc}>
        <div className={s.text}>
          Configurations are for exploratory purposes only. Room guides and the
          prices listed are based on local MSRP for the products and are not
          formal quotes. Prices may vary by location, channel or reseller.
        </div>

        {!!totalAmount && (
          <div className={s.total_amount}>
            <div className={s.total}>Total</div>
            <div className={s.amount}>
              <div className={s.amount_value}>{totalAmount}</div>
              <div className={s.amount_text}>MSRP</div>
            </div>
          </div>
        )}
      </div>
      <div className={s.buttons}>
        <Actions />
      </div>
    </div>
  );
};
