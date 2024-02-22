import s from "./Content.module.scss";
import React from "react";
import { PrepareSection } from "./PrepareSections/PrepareSection";
import { ConfiguratorSection } from "./ConfiguratorSections/ConfiguratorSection";
import { LoaderSection } from "./LoaderSection/LoaderSection";
import { ActionsContent } from "./ActionsContent/ActionsContent";

interface PropsI {}
export const Content: React.FC<PropsI> = () => {
  return (
    <div className={s.container}>
      <div className={s.content}>
        <PrepareSection />
        <ConfiguratorSection />
      </div>

      <ActionsContent />

      <LoaderSection />
    </div>
  );
};
