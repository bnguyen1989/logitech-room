import React from "react";
import s from "./Section.module.scss";
import { Card } from "./Card/Card";
import { SectionI } from "../../type";
import { StepName } from "../../../../utils/baseUtils";

export const Section: React.FC<SectionI> = (props) => {
  const { title, data, typeSection } = props;

  const isBundleSections = typeSection === "Room Solution Bundles";
  const hideProperties: any = isBundleSections ? ["partNumber", "price"] : [];
  const dependenceCards =
    typeSection === StepName.SoftwareServices && data.length > 1
      ? data.slice(1)
      : [];

  const dataArr = dependenceCards.length ? [data[0]] : data;
  return (
    <div className={s.container}>
      <div className={s.title}>{title}:</div>
      <div className={s.divider}></div>
      <div className={s.cards}>
        {dataArr.map((item, index) => (
          <div key={index} className={s.wrapper}>
            <Card
              {...item}
              hideProperties={hideProperties}
              dependenceCards={dependenceCards}
            />
            {index !== dataArr.length - 1 && <div className={s.divider}></div>}
          </div>
        ))}
        {isBundleSections && (
          <div className={s.wrapper}>
            <div className={s.divider}></div>
            <Card
              partNumber={dataArr[0]?.partNumber}
              count={dataArr[0]?.count}
              priceData={dataArr[0]?.priceData}
              inStock={dataArr[0]?.inStock}
              mode="bundle"
            />
          </div>
        )}
      </div>
      {isBundleSections && dataArr[0]?.priceData?.amount !== undefined && (
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
