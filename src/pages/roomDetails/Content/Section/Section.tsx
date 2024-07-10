import React from "react";
import s from "./Section.module.scss";
import { Card } from "./Card/Card";
import { SectionI } from "../../type";

export const Section: React.FC<SectionI> = (props) => {
  const { title, data, typeSection } = props;

  const isBundleSections = typeSection === "Room Solution Bundles";
  return (
    <div className={s.container}>
      <div className={s.title}>{title}:</div>
      <div className={s.divider}></div>
      <div className={s.cards}>
        {data.map((item, index) => (
          <div key={index} className={s.wrapper}>
            <Card {...item} isHideDetails={!isBundleSections} />
            {index !== data.length - 1 && <div className={s.divider}></div>}
          </div>
        ))}
        {isBundleSections && (
          <div className={s.wrapper}>
            <div className={s.divider}></div>
            <Card
              partNumber={data[0]?.partNumber}
              count={data[0]?.count}
              amount={data[0]?.amount}
              inStock={data[0]?.inStock}
              isBundleCard
            />
          </div>
        )}
      </div>
      {isBundleSections && (
        <div className={s.bundle}>
          <div className={s.bundleText}>
            *Price and part number reflect ease and savings of an automatic
            bundle
          </div>
        </div>
      )}
    </div>
  );
};
