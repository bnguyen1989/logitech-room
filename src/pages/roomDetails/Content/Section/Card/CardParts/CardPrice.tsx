import React from "react";
import s from "../Card.module.scss";
import { useAppSelector } from "../../../../../../hooks/redux";
import { getDetailRoomLangPage } from "../../../../../../store/slices/ui/selectors/selectoteLangPage";
import { PriceDataI } from "../../../../type";

export const CardPrice: React.FC<{
  priceData?: PriceDataI;
  isHide: boolean;
}> = ({ priceData, isHide }) => {
  const langPage = useAppSelector(getDetailRoomLangPage);

  if (isHide) return <div className={s.amount}></div>;

  if (!priceData) return null;

  if (priceData?.isContactReseller) {
    return (
      <div className={s.amount}>
        <div className={s.amount_price}>
          <div className={s.amount_text_contact_reseller}>
            {langPage.Card.ContactLocalReseller}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.amount}>
      <div className={s.amount_mobile_title}>{langPage.Card.Price}</div>
      <div className={s.amount_price}>
        <div className={s.amount_vales}>
          {!!priceData?.strikeThroughPrice && (
            <div className={s.amount_strike_through}>
              {priceData?.strikeThroughPrice}
            </div>
          )}
          <div className={s.amount_value}>{priceData?.amount}</div>
        </div>

        <div className={s.amount_text}>
          {langPage.Card.MSRP} {langPage.Card.PerUnit}
        </div>
      </div>
    </div>
  );
};
