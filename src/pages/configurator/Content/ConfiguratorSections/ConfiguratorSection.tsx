import { Player } from "../../../../components/Player/Player";
import s from "./ConfiguratorSection.module.scss";
import { ConfigurationFormForStep } from "./ConfigurationFormForStep/ConfigurationFormForStep";
import { LoaderPlayer } from "./LoaderPlayer/LoaderPlayer";
import { ContentContainer } from "../ContentContainer/ContentContainer";
import { PlayerWidgets } from "../../../../components/PlayerWidgets/PlayerWidgets";

interface ConfiguratorSectionIn {
  refHeader?: any;
}
export const ConfiguratorSection: React.FC<ConfiguratorSectionIn> = ({
  refHeader,
}) => {
  return (
    <ContentContainer>
      <div className={s.container_configuratorSection}>
        <div className={s.wrapper}>
          <div className={s.player}>
            <Player />
            <LoaderPlayer />
            <PlayerWidgets />
          </div>
          <ConfigurationFormForStep refHeader={refHeader} />
        </div>
      </div>
    </ContentContainer>
  );
};
