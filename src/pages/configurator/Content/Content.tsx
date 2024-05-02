import s from "./Content.module.scss";
import React from "react";
import { PrepareSection } from "./PrepareSections/PrepareSection";
import { ConfiguratorSection } from "./ConfiguratorSections/ConfiguratorSection";
import { LoaderSection } from "./LoaderSection/LoaderSection";
import { ActionsContent } from "./ActionsContent/ActionsContent";
import { Heading } from "./Heading/Heading";

interface PropsI {}
export const Content: React.FC<PropsI> = () => {
  return (
    <div className={s.container}>
      <Heading />
      <div className={s.content}>
        <PrepareSection />
        <ConfiguratorSection />
      </div>

      <ActionsContent />
      <LoaderSection />
    </div>
  );
};
