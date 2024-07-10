import React from "react";
import s from "./Card.module.scss";
import { DataSectionI } from "../../../type";
import { useAppSelector } from "../../../../../hooks/redux";
import {
  getCSVLangPage,
  getDetailRoomLangPage,
} from "../../../../../store/slices/ui/selectors/selectoteLangPage";

interface PropsI extends DataSectionI {
  isHideDetails?: boolean;
  isBundleCard?: boolean;
}
export const Card: React.FC<PropsI> = (props) => {
  const {
    image,
    title,
    subtitle,
    partNumber,
    count,
    amount,
    labelValue,
    strikeThroughPrice,
    inStock,
    isHideDetails = true,
    isBundleCard = false,
  } = props;
  const langPage = useAppSelector(getDetailRoomLangPage);
  const langPageCSV = useAppSelector(getCSVLangPage);

  return (
    <div className={`${s.container} ${!inStock ? s.container_disabled : ""}`}>
      <div className={s.left_content}>
        <div className={s.image}>
          {!!image && <img src={image} alt="image_item" />}
        </div>
      </div>
      <div className={s.right_content}>
        <div className={s.text}>
          {!!title && <div className={s.title}>{title}</div>}
          {!!subtitle && <div className={s.subtitle}>{subtitle}</div>}
        </div>
        {!!partNumber && isHideDetails && (
          <div className={s.part_number}>
            <div className={s.part_number_text}>{`${langPage.Card.PartNumber}${
              isBundleCard ? "*" : ""
            }`}</div>
            <div className={s.part_number_value}>{partNumber}</div>
          </div>
        )}
        {!isHideDetails && <div className={s.part_number}></div>}
        {!!count && <div className={s.count}>x {count}</div>}
        {!!count && (
          <div className={s.count_mobile}>
            <div className={s.count_mobile_text}>
              {langPageCSV.Header.Quantity}
            </div>
            <div className={s.count_mobile_value}>x{count}</div>
          </div>
        )}
        {!isHideDetails && <div className={s.amount}></div>}
        {!!amount && isHideDetails && (
          <div className={s.amount}>
            <div className={s.amount_mobile_title}>{langPage.Card.Price}</div>
            <div className={s.amount_price}>
              <div className={s.amount_vales}>
                {!!strikeThroughPrice && (
                  <div className={s.amount_strike_through}>
                    {strikeThroughPrice}
                  </div>
                )}
                <div className={s.amount_value}>{amount}</div>
              </div>

              <div className={s.amount_text}>
                {langPage.Card.MSRP} {langPage.Card.PerUnit}
              </div>
            </div>
          </div>
        )}
        {!!labelValue && <div className={s.value}>{labelValue}</div>}
      </div>
    </div>
  );
};
