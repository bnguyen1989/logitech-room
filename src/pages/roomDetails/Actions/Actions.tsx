import React from "react";
import s from "./Actions.module.scss";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { DownloadSVG, ListSVG } from "../../../assets";
import { Button } from "../../../components/Buttons/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { Application } from "../../../models/Application";
import { useUrl } from "../../../hooks/url";
import { useUser } from "../../../hooks/user";
import { PermissionUser } from "../../../utils/userRoleUtils";

declare const app: Application;

export const Actions: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { handleNavigate } = useUrl();
  const user = useUser();

  const handlerDownload = () => {
    if (!roomId) return;
    app.downloadRoomCSV(roomId);
  };

  const handleRequestConsultation = () => {
    navigate("/request-consultation");
  };

  const handleBack = () => {
    handleNavigate("/room");
  };

  const userCanReqConsultation = user.role.can(
    PermissionUser.REQUEST_CONSULTATION
  );

  return (
    <div className={s.container}>
      <div className={s.mobile}>
        <IconButton onClick={handleBack} variant={"outlined"}>
          <ListSVG />
        </IconButton>
        <IconButton
          onClick={handlerDownload}
          variant={"outlined"}
        >
          <DownloadSVG />
        </IconButton>
      </div>
      <div className={s.desktop}>
      <IconButton text={"Back"} onClick={handleBack} variant={"outlined"}>
          <ListSVG />
        </IconButton>
        <IconButton
          text={"Download Room Guide"}
          onClick={handlerDownload}
          variant={"outlined"}
        >
          <DownloadSVG />
        </IconButton>
      </div>
      {userCanReqConsultation && (
        <Button
          onClick={handleRequestConsultation}
          text={"Request Consultation"}
          variant={"contained"}
          style={{
            padding: "19px 40px",
          }}
        />
      )}
    </div>
  );
};
