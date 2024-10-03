import React from "react";
import s from "../Card.module.scss";
import { DataSectionI } from "../../../../type";

export const DependenceCards: React.FC<{ dependenceCards: DataSectionI[] }> = ({
  dependenceCards,
}) => {
  if (dependenceCards.length === 0) return null;

  const dependentTitles = dependenceCards.map((item) => item.title).join(", ");

  return <div className={s.subtitle}>For Product: {dependentTitles}</div>;
};
