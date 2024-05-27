import { Player } from "../../../../components/Player/Player";
import s from "./ConfiguratorSection.module.scss";
import { ConfigurationFormForStep } from "./ConfigurationFormForStep/ConfigurationFormForStep";
import { LoaderPlayer } from "./LoaderPlayer/LoaderPlayer";
import { ContentContainer } from "../ContentContainer/ContentContainer";

export const ConfiguratorSection: React.FC = () => {
  return (
    <ContentContainer>
      <div className={s.container_configuratorSection}>
        <div className={s.wrapper}>
          <div className={s.player}>
            <Player />
            <LoaderPlayer />
          </div>
          <ConfigurationFormForStep />
        </div>
      </div>
    </ContentContainer>
  );
};
