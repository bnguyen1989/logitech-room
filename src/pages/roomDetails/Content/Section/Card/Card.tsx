import React from "react";
import s from "./Card.module.scss";
import { DataSectionI } from "../../../type";
import { useAppSelector } from "../../../../../hooks/redux";
import {
  getCSVLangPage,
  getDetailRoomLangPage,
} from "../../../../../store/slices/ui/selectors/selectoteLangPage";

export const Card: React.FC<DataSectionI> = (props) => {
  const {
    image,
    title,
    subtitle,
    partNumber,
    count,
    amount,
    selectValue,
    labelValue,
  } = props;
  const langPage = useAppSelector(getDetailRoomLangPage);
  const langPageCSV = useAppSelector(getCSVLangPage);

  return (
    <div className={s.container}>
      <div className={s.left_content}>
        <div className={s.image}>
          <img src={image} alt="image_item" />
        </div>
      </div>
      <div className={s.right_content}>
        <div className={s.text}>
          <div className={s.title}>{title}</div>
          <div className={s.subtitle}>{subtitle}</div>
        </div>
        {!!partNumber && (
          <div className={s.part_number}>
            <div className={s.part_number_text}>{langPage.Card.PartNumber}</div>
            <div className={s.part_number_value}>{partNumber}</div>
          </div>
        )}
        {!!count && <div className={s.count}>x {count}</div>}
        {!!count && (
          <div className={s.count_mobile}>
            <div className={s.count_mobile_text}>
              {langPageCSV.Header.Quantity}
            </div>
            <div className={s.count_mobile_value}>x{count}</div>
          </div>
        )}
        {!!amount && (
          <div className={s.amount}>
            <div className={s.amount_mobile_title}>{langPage.Card.Price}</div>
            <div className={s.amount_price}>
              <div className={s.amount_value}>{amount}</div>
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
