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
import { isExtendWarranty } from "../../../../../utils/permissionUtils";
import { getUrlProductByKeyPermission } from "../../../../../utils/productUtils";

interface PropsI extends DataSectionI {
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
    hideProperties = [],
    dependenceCards,
    keyPermission = "",
  } = props;

  const isBundle = mode === "bundle";
  const isSoftwareCard = isExtendWarranty(keyPermission);
  const isHidePartNumber =
    hideProperties.includes("partNumber") || isSoftwareCard;
  const isHidePrice = hideProperties.includes("price");

  const linkProduct = getUrlProductByKeyPermission(keyPermission);

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
          link={linkProduct}
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
