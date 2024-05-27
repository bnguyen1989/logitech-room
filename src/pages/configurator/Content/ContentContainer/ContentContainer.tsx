import React from "react";
import s from "./ContentContainer.module.scss";
import { Heading } from "../Heading/Heading";
import { ActionsContent } from "../ActionsContent/ActionsContent";
import { LoaderSection } from "../LoaderSection/LoaderSection";

interface PropsI {
  children: React.ReactNode;
}
export const ContentContainer: React.FC<PropsI> = (props) => {
  const { children } = props;

  return (
    <div className={s.container}>
      <Heading />
      {children}

      <div className={s.wrapControl}>
        <ActionsContent />
      </div>
      <LoaderSection />
    </div>
  );
};
