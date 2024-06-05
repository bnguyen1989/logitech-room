import React from "react";
import s from "./Card.module.scss";
import { DataSectionI } from "../../../type";

export const Card: React.FC<DataSectionI> = (props) => {
  const { image, title, subtitle, partNumber, count, amount, selectValue } =
    props;
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
            <div className={s.part_number_text}>PART NUMBER</div>
            <div className={s.part_number_value}>{partNumber}</div>
          </div>
        )}
        {!!count && <div className={s.count}>x {count}</div>}
        {!!count && (
          <div className={s.count_mobile}>
            <div className={s.count_mobile_text}>QUANTITY</div>
            <div className={s.count_mobile_value}>x{count}</div>
          </div>
        )}
        {!!amount && (
          <div className={s.amount}>
            <div className={s.amount_mobile_title}>PRICE</div>
            <div className={s.amount_price}>
              <div className={s.amount_value}>{amount}</div>
              <div className={s.amount_text}>MSRP per unit</div>
            </div>
          </div>
        )}
        {!!selectValue && <div className={s.value}>{selectValue}</div>}
      </div>
    </div>
  );
};
