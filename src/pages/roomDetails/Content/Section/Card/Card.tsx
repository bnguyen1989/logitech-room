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
        <div
          className={s.text}
          style={{
            width: partNumber ? "335px" : "790px",
          }}
        >
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
        {!!amount && (
          <div className={s.amount}>
            <div className={s.amount_value}>{amount}</div>
            <div className={s.amount_text}>MSRP</div>
          </div>
        )}
        {!!selectValue && <div className={s.value}>{selectValue}</div>}
      </div>
    </div>
  );
};
