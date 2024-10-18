import React from "react";
import s from "../Card.module.scss";
import { DependenceCards } from "./DependenceCards";
import { DataSectionI } from "../../../../type";

interface PropsI {
  title?: string;
  subtitle?: string;
  dependenceCards?: DataSectionI[];
  link?: string;
}
export const CardText: React.FC<PropsI> = ({
  title,
  subtitle,
  dependenceCards = [],
  link,
}) => {
  const handleClick = () => {
    if (link) window.open(link, "_blank");
  };
  return (
    <div className={s.text}>
      <div
        className={s.title}
        style={{
          cursor: link ? "pointer" : "default",
        }}
        onClick={handleClick}
      >
        {title}
      </div>
      {subtitle && <div className={s.subtitle}>{subtitle}</div>}
      <DependenceCards dependenceCards={dependenceCards} />
    </div>
  );
};
