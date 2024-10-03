import React from "react";
import s from "../Card.module.scss";
import { useAppSelector } from "../../../../../../hooks/redux";
import { getCSVLangPage } from "../../../../../../store/slices/ui/selectors/selectoteLangPage";

export const CardCount: React.FC<{ count?: string }> = ({ count }) => {
  const langPageCSV = useAppSelector(getCSVLangPage);

  if (!count) return null;

  return (
    <>
      <div className={s.count}>x {count}</div>
      <div className={s.count_mobile}>
        <div className={s.count_mobile_text}>{langPageCSV.Header.Quantity}</div>
        <div className={s.count_mobile_value}>x{count}</div>
      </div>
    </>
  );
};
