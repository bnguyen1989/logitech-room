import React from "react";
import s from "../Card.module.scss";
import { DataSectionI } from "../../../../type";
import { useAppSelector } from "../../../../../../hooks/redux";
import { getDetailRoomLangPage } from "../../../../../../store/slices/ui/selectors/selectoteLangPage";

export const DependenceCards: React.FC<{ dependenceCards: DataSectionI[] }> = ({
  dependenceCards,
}) => {
  const langPage = useAppSelector(getDetailRoomLangPage);
  if (dependenceCards.length === 0) return null;

  const dependentTitles = dependenceCards.map((item) => item.title).join(", ");

  return (
    <div className={s.subtitle}>
      {langPage.Card.ForProduct}: {dependentTitles}
    </div>
  );
};
