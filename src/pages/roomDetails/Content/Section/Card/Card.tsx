import React from "react";
import s from "./Card.module.scss";
import { DataSectionI } from "../../../type";
import {
  CardCount,
  CardImage,
  CardPartNumber,
  CardPrice,
  CardText,
} from "./CardParts";

interface PropsI extends DataSectionI {
  type: "item" | "software";
  mode?: "bundle" | "default";
  hideProperties?: ("partNumber" | "count" | "price")[];
  dependenceCards?: DataSectionI[];
}

export const Card: React.FC<PropsI> = (props) => {
  const {
    image,
    title,
    subtitle,
    partNumber,
    count,
    priceData,
    labelValue,
    inStock,
    mode = "default",
    type = "item",
    hideProperties = [],
    dependenceCards,
  } = props;

  const isBundle = mode === "bundle";
  const isSoftwareCard = type === "software";
  const isHidePartNumber =
    hideProperties.includes("partNumber") || (!partNumber && !isSoftwareCard);
  const isHidePrice = hideProperties.includes("price");

  return (
    <div className={`${s.container} ${!inStock ? s.container_disabled : ""}`}>
      <div className={s.left_content}>
        <CardImage image={image} />
      </div>
      <div className={s.right_content}>
        <CardText
          title={title}
          subtitle={subtitle}
          dependenceCards={dependenceCards}
        />

        <CardPartNumber
          partNumber={partNumber}
          isHide={isHidePartNumber}
          isBundle={isBundle}
        />

        <CardCount count={count} />

        {!!labelValue && <div className={s.value}>{labelValue}</div>}

        <CardPrice priceData={priceData} isHide={isHidePrice} />
      </div>
    </div>
  );
};
