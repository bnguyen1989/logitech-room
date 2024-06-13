import { ChainLinkSVG, DownloadSVG, ShareSVG } from "../../../assets";
import { Button } from "../../../components/Buttons/Button/Button";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { Application } from "../../../models/Application";
import s from "./Header.module.scss";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/user";
import { copyToClipboard, getImageUrl } from "../../../utils/browserUtils";
import { useDispatch } from "react-redux";
import {
  setRequestConsultationModal,
  setShareProjectModal,
} from "../../../store/slices/modals/Modals.slice";
import { PermissionUser } from "../../../utils/userRoleUtils";
import { useUrl } from "../../../hooks/url";
import {
  EventActionName,
  EventCategoryName,
} from "../../../models/analytics/type";
import { useAppSelector } from "../../../hooks/redux";
import { getRoomsLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";
import { useEffect } from "react";
import { getTKAnalytics } from "../../../utils/getTKAnalytics";

declare const app: Application;

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useUser();
  const { getNavLink } = useUrl();
  const langPage = useAppSelector(getRoomsLangPage);

  useEffect(() => {
    getTKAnalytics().stage({ stageName: EventCategoryName.summary_page });
  }, []);

  const handleAnotherRoom = () => {
    navigate("/configurator", { replace: true });

    getTKAnalytics().custom({ customName: EventActionName.add_another_room });
    app.analyticsEvent({
      category: EventCategoryName.summary_page,
      action: EventActionName.add_another_room,
      value: {},
    });
  };

  const handleDownloadAll = () => {
    app.downloadRoomsCSV(user.id);
    getTKAnalytics().custom({ customName: EventActionName.download_room_all });

    app.analyticsEvent({
      category: EventCategoryName.summary_page,
      action: EventActionName.download_room_all,
      value: {
        userId: user.id,
      },
    });
  };

  const handleShareUserRooms = () => {
    const searchParams = new URLSearchParams();
    searchParams.set("userId", user.id);
    const url = getNavLink("/room", searchParams);
    copyToClipboard(url);

    getTKAnalytics().custom({ customName: EventActionName.share_project });
    app.analyticsEvent({
      category: EventCategoryName.summary_page,
      action: EventActionName.share_project,
      value: {
        link: url,
      },
    });
  };

  const handleRequestConsultation = () => {
    getTKAnalytics().custom({
      customName: EventActionName.request_consultation,
    });

    app.analyticsEvent({
      category: EventCategoryName.summary_page,
      action: EventActionName.request_consultation,
      value: {},
    });

    dispatch(setRequestConsultationModal({ isOpen: true }));
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
            <div className={s.header_title}>{langPage.header.name}</div>
            <div className={s.header_subtitle}>{langPage.header.title}</div>
            {userCanReqConsultation && (
              <div className={s.desc}>
                {Object.values(langPage.header.subtitle).join(" ")}
              </div>
            )}
          </div>
          <div className={s.header_action}>
            <IconButton
              onClick={handleShareUserRooms}
              text={langPage.header.buttons.CopyYourCustomURL}
              variant={userCanReqConsultation ? "outlined" : "contained"}
            >
              <ChainLinkSVG
                color={userCanReqConsultation ? "black" : "white"}
              />
            </IconButton>
            {userCanReqConsultation && (
              <Button
                onClick={handleRequestConsultation}
                text={langPage.header.buttons.RequestConsultation}
                variant={"contained"}
              />
            )}
          </div>
        </div>
      </div>
      <div className={s.text}>
        <div className={s.title}>{langPage.title}</div>
        <div className={s.subtitle}>
          {userCanReqConsultation ? langPage.subtitle.v1 : langPage.subtitle.v2}
        </div>
      </div>
      <div className={s.buttons}>
        {userCanAddRoom && (
          <Button
            onClick={handleAnotherRoom}
            text={langPage.buttons.AddAnotherRoom}
            variant={"contained"}
          />
        )}
        <IconButton
          onClick={handleDownloadAll}
          text={langPage.buttons.DownloadRoomGuideAll}
          variant={"outlined"}
        >
          <DownloadSVG />
        </IconButton>
        <IconButton
          onClick={handleShareProject}
          text={langPage.buttons.ShareYourProject}
          variant={"outlined"}
        >
          <ShareSVG />
        </IconButton>
      </div>
    </div>
  );
};
