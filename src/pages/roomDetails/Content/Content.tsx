import React from "react";
import s from "./Content.module.scss";
import { Section } from "./Section/Section";
import { SectionI } from "../type";

interface PropsI {
  sections: Array<SectionI>;
}
export const Content: React.FC<PropsI> = (props) => {
  const { sections } = props;

  return (
    <div className={s.container}>
      {sections.map((item, index) => (
        <Section key={index} {...item} />
      ))}
    </div>
  );
};
