import React from "react";
import s from "./Card.module.scss";
import { DataSectionI } from "../../../type";
import { useAppSelector } from "../../../../../hooks/redux";
import {
  getCSVLangPage,
  getDetailRoomLangPage,
} from "../../../../../store/slices/ui/selectors/selectoteLangPage";

interface PropsI extends DataSectionI {
  mode?: "bundle" | "default";
  hideProperties?: ("partNumber" | "count" | "price")[];
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
  } = props;
  const langPage = useAppSelector(getDetailRoomLangPage);
  const langPageCSV = useAppSelector(getCSVLangPage);

  const isBundle = mode === "bundle";
  const isHidePartNumber = hideProperties.includes("partNumber");
  const isHidePrice = hideProperties.includes("price");

  const isSoftwareCard = !count && !priceData?.amount;

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
        {!!partNumber && !isHidePartNumber && (
          <div className={s.part_number}>
            <div className={s.part_number_text}>{`${langPage.Card.PartNumber}${
              isBundle ? "*" : ""
            }`}</div>
            <div className={s.part_number_value}>{partNumber}</div>
          </div>
        )}
        {(isHidePartNumber ||
          (!partNumber && !isHidePartNumber && !isSoftwareCard)) && (
          <div className={s.part_number}></div>
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
        {isHidePrice && <div className={s.amount}></div>}
        {!!priceData?.amount &&
          !priceData.isContactReseller &&
          !isHidePrice && (
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
          )}
        {!!priceData?.isContactReseller && (
          <div className={s.amount}>
            <div className={s.amount_price}>
              <div className={s.amount_text_contact_reseller}>
                {langPage.Card.ContactLocalReseller}
              </div>
            </div>
          </div>
        )}
        {!!labelValue && <div className={s.value}>{labelValue}</div>}
      </div>
    </div>
  );
};
