import { ChainLinkSVG, DownloadSVG, ShareSVG } from "../../../assets";
import { Button } from "../../../components/Buttons/Button/Button";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { Application } from "../../../models/Application";
import s from "./Header.module.scss";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/user";
import { copyToClipboard, getImageUrl } from "../../../utils/browserUtils";
import { useDispatch } from "react-redux";
import { setShareProjectModal } from "../../../store/slices/modals/Modals.slice";
import { PermissionUser } from "../../../utils/userRoleUtils";
import { useUrl } from "../../../hooks/url";

declare const app: Application;

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useUser();
  const { getNavLink } = useUrl();

  const handleAnotherRoom = () => {
    navigate("/configurator", { replace: true });
  };

  const handleDownloadAll = () => {
    app.downloadRoomsCSV(user.id);
  };

  const handleShareUserRooms = () => {
    const searchParams = new URLSearchParams();
    searchParams.set("userId", user.id);
    const url = getNavLink("/room", searchParams);
    copyToClipboard(url);
  };

  const handleRequestConsultation = () => {
    navigate("/request-consultation");
  };

  const handleShareProject = () => {
    dispatch(setShareProjectModal({ isOpen: true }));
  };

  const userCanReqConsultation = user.role.can(
    PermissionUser.REQUEST_CONSULTATION
  );
  const userCanAddRoom = user.role.can(PermissionUser.ADD_ROOM);

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.banner}>
          <img
            src={getImageUrl("images/pages/room/room_banner.png")}
            alt="banner"
          />
        </div>
        <div className={s.header_content}>
          <div className={s.header_text}>
            <div className={s.header_title}>Project Summary</div>
            <div className={s.header_subtitle}>
              Thank you for your interest in Logitech!
            </div>
            {userCanReqConsultation && (
              <div className={s.desc}>
                Explore your finished room(s) below, and when you're ready to
                talk next steps, simply <u>request a consultation</u>. We'd be
                happy to discuss your project, develop a formal quote, and
                facilitate next steps, whether through Logitech or your
                preferred partner.
              </div>
            )}
          </div>
          <div className={s.header_action}>
            <IconButton
              onClick={handleShareUserRooms}
              text={"Copy Your Custom URL"}
              variant={userCanReqConsultation ? "outlined" : "contained"}
            >
              <ChainLinkSVG
                color={userCanReqConsultation ? "black" : "white"}
              />
            </IconButton>
            {userCanReqConsultation && (
              <Button
                onClick={handleRequestConsultation}
                text={"Request Consultation"}
                variant={"contained"}
              />
            )}
          </div>
        </div>
      </div>
      <div className={s.text}>
        <div className={s.title}>Explore Your Finished Rooms</div>
        <div className={s.subtitle}>
          Configurations are for exploratory purposes only. Room guides and the
          prices listed are based on local MSRP for the products and are not
          formal quotes. Prices may vary by location, channel or reseller.
          {userCanReqConsultation && (
            <span>
              {" "}
              Please <u>request a consultation</u> for more information and next
              steps.
            </span>
          )}
        </div>
      </div>
      <div className={s.buttons}>
        {userCanAddRoom && (
          <Button
            onClick={handleAnotherRoom}
            text={"Add Another Room"}
            variant={"contained"}
          />
        )}
        <IconButton
          onClick={handleDownloadAll}
          text={"Download Room Guide (All)"}
          variant={"outlined"}
        >
          <DownloadSVG />
        </IconButton>
        <IconButton
          onClick={handleShareProject}
          text={"Share Your Project"}
          variant={"outlined"}
        >
          <ShareSVG />
        </IconButton>
      </div>
    </div>
  );
};
