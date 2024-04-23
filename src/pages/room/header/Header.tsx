import { ChainLinkSVG, DownloadSVG, ShareSVG } from "../../../assets";
import { Button } from "../../../components/Buttons/Button/Button";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { Application } from "../../../models/Application";
import s from "./Header.module.scss";
import { useNavigate } from "react-router-dom";
import ImgBanner from "../../../assets/images/pages/room/room_banner.png";
import { useUser } from "../../../hooks/user";
import { copyToClipboard, getParentURL } from "../../../utils/browserUtils";

declare const app: Application;

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useUser();

  const handleAnotherRoom = () => {
    navigate("/configurator", { replace: true });
  };

  const handleDownloadAll = () => {
    app.downloadRoomsCSV(userId);
  };

  const handleShareUserRooms = () => {
    const url = `${getParentURL()}/room?userId=${userId}`;
    copyToClipboard(url);
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.banner}>
          <img src={ImgBanner} alt="banner" />
        </div>
        <div className={s.header_content}>
          <div className={s.header_text}>
            <div className={s.header_title}>Project Summary</div>
            <div className={s.header_subtitle}>
              Thank you for your interest in Logitech!
            </div>
            <div className={s.desc}>
              Explore your finished room(s) below, and when you're ready to talk
              next steps, simply <u>request a consultation</u>. We'd be happy to
              discuss your project, develop a formal quote, and facilitate next
              steps, whether through Logitech or your preferred partner.
            </div>
          </div>
          <div className={s.header_action}>
            <IconButton
              onClick={handleShareUserRooms}
              text={"Copy Your Custom URL"}
              variant={"outlined"}
            >
              <ChainLinkSVG />
            </IconButton>
            <Button
              onClick={() => {}}
              text={"Request Consultation"}
              variant={"contained"}
            />
          </div>
        </div>
      </div>
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
          onClick={handleShareUserRooms}
          text={"Share Your Project"}
          variant={"outlined"}
        >
          <ShareSVG />
        </IconButton>
      </div>
    </div>
  );
};
