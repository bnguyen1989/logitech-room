import React from "react";
import s from "./ContentContainer.module.scss";
import { Heading } from "../Heading/Heading";
import { ActionsContent } from "../ActionsContent/ActionsContent";
import { LoaderSection } from "../LoaderSection/LoaderSection";

interface PropsI {
  children: React.ReactNode;
  refAction?: React.RefObject<HTMLDivElement>;
}
export const ContentContainer: React.FC<PropsI> = (props) => {
  const { children, refAction } = props;

  return (
    <div className={s.container}>
      <Heading />
      {children}

      <div ref={refAction} className={s.wrapControl}>
        <ActionsContent />
      </div>
      <LoaderSection />
    </div>
  );
};
