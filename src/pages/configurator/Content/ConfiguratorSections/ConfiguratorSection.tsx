import { Player } from "../../../../components/Player/Player";
import s from "./ConfiguratorSection.module.scss";
import { PlayerWidgets } from "../../../../components/PlayerWidgets/PlayerWidgets";
import { ConfigurationFormForStep } from "./ConfigurationFormForStep/ConfigurationFormForStep";
import { LoaderPlayer } from "./LoaderPlayer/LoaderPlayer";

export const ConfiguratorSection: React.FC = () => {
  return (
    <>
      <div className={s.container}>
        <div className={s.player}>
          <Player />
          <LoaderPlayer />
          <div className={s.widgets}>
            <PlayerWidgets />
          </div>
        </div>
        <ConfigurationFormForStep />
      </div>
    </>
  );
};
