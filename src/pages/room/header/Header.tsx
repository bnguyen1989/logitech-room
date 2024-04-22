import { DownloadSVG, ShareSVG } from "../../../assets";
import { Button } from "../../../components/Buttons/Button/Button";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { Application } from "../../../models/Application";
import { ConfigData } from "../../../utils/threekitUtils";
import s from "./Header.module.scss";
import { useNavigate } from "react-router-dom";

declare const app: Application;

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleAnotherRoom = () => {
    navigate("/configurator", { replace: true });
  };

  const handleDownloadAll = () => {
    app.downloadRoomsCSV(ConfigData.userId);
  };

  return (
    <div className={s.container}>
      <div className={s.text}>
        <div className={s.title}>Explore Your Finished Rooms</div>
        <div className={s.subtitle}>
          Configurations are for exploratory purposes only. Room guides and the
          prices listed are based on local MSRP for the products and are not
          formal quotes. Prices may vary by location, channel or reseller.
          Please <u>request a consultation</u> for more information and next
          steps.
        </div>
      </div>
      <div className={s.buttons}>
        <Button
          onClick={handleAnotherRoom}
          text={"Add Another Room"}
          variant={"contained"}
        />
        <IconButton
          onClick={handleDownloadAll}
          text={"Download Room Guide (All)"}
          variant={"outlined"}
        >
          <DownloadSVG />
        </IconButton>
        <IconButton
          onClick={() => {}}
          text={"Share Your Project"}
          variant={"outlined"}
        >
          <ShareSVG />
        </IconButton>
      </div>
    </div>
  );
};
