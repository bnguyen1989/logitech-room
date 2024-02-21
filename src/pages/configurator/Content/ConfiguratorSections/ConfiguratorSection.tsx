import { useDispatch } from "react-redux";
import { CardItem } from "../../../../components/Cards/CardItem/CardItem";
import { Player } from "../../../../components/Player/Player";
import { useAppSelector } from "../../../../hooks/redux";
import {
  changeActiveCard,
  changeValueCard,
} from "../../../../store/slices/ui/Ui.slice";
import {
  getActiveStep,
  getIsConfiguratorStep,
} from "../../../../store/slices/ui/selectors/selectors";
import {
  ItemCardI,
  StepCardType,
  StepI,
  StepName,
} from "../../../../store/slices/ui/type";
import s from "./ConfiguratorSection.module.scss";
import { PlayerWidgets } from "../../../../components/PlayerWidgets/PlayerWidgets";
import { Application } from "../../../../models/Application";
import { useEffect, useState } from "react";
import {
  getRoomAssetId,
  initThreekitData,
} from "../../../../utils/threekitUtils";
import { changeAssetId } from "../../../../store/slices/configurator/Configurator.slice";
import { Permission } from "../../../../models/permission/Permission";
import { SoftwareServiceSection } from "./SoftwareServiceSection/SoftwareServiceSection";
import { ConfigurationFormForStep } from "./ConfigurationFormForStep/ConfigurationFormForStep";

declare const app: Application;
declare const permission: Permission;

export const ConfiguratorSection: React.FC = () => { 
  const activeStep: null | StepI<StepCardType> = useAppSelector(getActiveStep);
  // const isConfiguratorStep = useAppSelector(getIsConfiguratorStep); 
  if (!activeStep) return null;

 
  return (
    <>
      <SoftwareServiceSection  
      />
      <div className={s.container}>
        <div
          className={s.player}
          style={{
            // opacity: isConfiguratorStep ? 1 : 0,
          }}
        >
          <Player />
          <div className={s.widgets}>
            <PlayerWidgets />
          </div>
        </div>
        <ConfigurationFormForStep />
        
      </div>
    </>
  );
};
