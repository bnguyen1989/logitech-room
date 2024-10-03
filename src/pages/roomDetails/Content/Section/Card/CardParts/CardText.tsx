import React from "react";
import s from "../Card.module.scss";
import { DependenceCards } from "./DependenceCards";
import { DataSectionI } from "../../../../type";

interface PropsI {
  title?: string;
  subtitle?: string;
  dependenceCards?: DataSectionI[];
}
export const CardText: React.FC<PropsI> = ({
  title,
  subtitle,
  dependenceCards = [],
}) => (
  <div className={s.text}>
    <div className={s.title}>{title}</div>
    {subtitle && <div className={s.subtitle}>{subtitle}</div>}
    <DependenceCards dependenceCards={dependenceCards} />
  </div>
);
