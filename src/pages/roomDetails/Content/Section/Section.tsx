import React from "react";
import s from "./Section.module.scss";
import { Card } from "./Card/Card";

interface PropsI {
  title: string;
  data: Array<{
    title: string;
    subtitle: string;
    image: string;
    partNumber?: string;
    count?: number;
    amount?: string;
    selectValue?: string;
  }>;
}
export const Section: React.FC<PropsI> = (props) => {
  const { title, data } = props;
  return (
    <div className={s.container}>
      <div className={s.title}>{title}:</div>
      <div className={s.divider}></div>
      <div className={s.cards}>
        {data.map((item, index) => (
          <div key={index} className={s.wrapper}>
            <Card {...item} />
            {index !== data.length - 1 && <div className={s.divider}></div>}
          </div>
        ))}
      </div>
    </div>
  );
};
