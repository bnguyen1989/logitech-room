import React from "react";
import s from "./Actions.module.scss";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { DownloadSVG, ListSVG } from "../../../assets";
import { Button } from "../../../components/Buttons/Button/Button";
import { useParams } from "react-router-dom";
import { Application } from "../../../models/Application";
import { useUrl } from "../../../hooks/url";
import { useUser } from "../../../hooks/user";
import { PermissionUser } from "../../../utils/userRoleUtils";
import {
  EventActionName,
  EventCategoryName,
} from "../../../models/analytics/type";
import { getTKAnalytics } from "../../../utils/getTKAnalytics";
import { useAppSelector } from "../../../hooks/redux";
import { getDetailRoomLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";
import { useDispatch } from "react-redux";
import { setRequestConsultationModal } from "../../../store/slices/modals/Modals.slice";
import { getLocale } from "../../../store/slices/ui/selectors/selectors";

declare const app: Application;

export const Actions: React.FC = () => {
  const dispatch = useDispatch();
  const { roomId } = useParams();
  const { handleNavigate } = useUrl();
  const user = useUser();
  const langPage = useAppSelector(getDetailRoomLangPage);
  const locale = useAppSelector(getLocale);

  const handlerDownload = () => {
    if (!roomId) return;
    app.downloadRoomCSV(roomId, locale || undefined);

    getTKAnalytics().custom({ customName: EventActionName.download_room });

    app.analyticsEvent({
      category: EventCategoryName.room_page,
      action: EventActionName.download_room,
      value: {
        id_room: roomId,
      },
    });
  };

  const handleRequestConsultation = () => {
    getTKAnalytics().stage({ stageName: EventActionName.request_consultation });

    app.analyticsEvent({
      category: EventCategoryName.room_page,
      action: EventActionName.request_consultation,
      value: {},
    });

    dispatch(setRequestConsultationModal({ isOpen: true }));
  };

  const handleBack = () => {
    handleNavigate("/room");
    app.analyticsEvent({
      category: EventCategoryName.room_page,
      action: EventActionName.back_to_summary_page,
      value: {},
    });
  };

  const userCanReqConsultation = user.role.can(
    PermissionUser.REQUEST_CONSULTATION
  );

  return (
    <div className={s.container}>
      <div className={s.mobile}>
        <IconButton
          onClick={handleBack}
          variant={"outlined"}
          dataAnalytics={"room-details-back"}
        >
          <ListSVG />
        </IconButton>
        <IconButton
          onClick={handlerDownload}
          variant={"outlined"}
          dataAnalytics={"room-details-download"}
        >
          <DownloadSVG />
        </IconButton>
      </div>
      <div className={s.desktop}>
        <IconButton
          text={langPage.buttons.Back}
          onClick={handleBack}
          variant={"outlined"}
          dataAnalytics={"room-details-back"}
        >
          <ListSVG />
        </IconButton>
        <IconButton
          text={langPage.buttons.DownloadRoomGuide}
          onClick={handlerDownload}
          variant={"outlined"}
          dataAnalytics={"room-details-download"}
        >
          <DownloadSVG />
        </IconButton>
      </div>
      {userCanReqConsultation && (
        <Button
          onClick={handleRequestConsultation}
          text={langPage.buttons.RequestConsultation}
          variant={"contained"}
          style={{
            padding: "19px 40px",
          }}
          dataAnalytics={"room-details-request-consultation"}
        />
      )}
    </div>
  );
};
