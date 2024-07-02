import s from "./Content.module.scss";
import React from "react";
import { PrepareSection } from "./PrepareSections/PrepareSection";
import { SoftwareServiceSection } from "./SoftwareServiceSection/SoftwareServiceSection";
import { ConfiguratorSection } from "./ConfiguratorSections/ConfiguratorSection";
import { useAppSelector } from "../../../hooks/redux";
import { getIsIncludePlayer } from "../../../store/slices/ui/selectors/selectors";

interface PropsI {
  refHeader?: any;
}
export const Content: React.FC<PropsI> = ({ refHeader }) => {
  const isPlayer = useAppSelector(getIsIncludePlayer);
  return (
    <div className={s.container}>
      {!isPlayer && (
        <div className={s.prepare_content}>
          <PrepareSection refHeader={refHeader} />
          <SoftwareServiceSection refHeader={refHeader} />
        </div>
      )}
      <div
        className={`${s.plyer_content} ${
          isPlayer ? `${s.player_visible} ${s.fixHeight}` : ""
        }`}
      >
        <ConfiguratorSection />
      </div>
    </div>
  );
};
