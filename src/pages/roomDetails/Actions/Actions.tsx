import React from "react";
import s from "./Actions.module.scss";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { DownloadSVG, ListSVG } from "../../../assets";
import { Button } from "../../../components/Buttons/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { Application } from "../../../models/Application";
import { useUrl } from "../../../hooks/url";

declare const app: Application;

export const Actions: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { handleNavigate } = useUrl("/room");

  const handlerDownload = () => {
    if (!roomId) return;
    app.downloadRoomCSV(roomId);
  };

  const handleRequestConsultation = () => {
    navigate("/request-consultation");
  };

  return (
    <div className={s.container}>
      <IconButton text={"Back"} onClick={handleNavigate} variant={"outlined"}>
        <ListSVG />
      </IconButton>
      <IconButton
        text={"Download Room Guide"}
        onClick={handlerDownload}
        variant={"outlined"}
      >
        <DownloadSVG />
      </IconButton>
      <Button
        onClick={handleRequestConsultation}
        text={"Request Consultation"}
        variant={"contained"}
        style={{
          padding: "19px 40px",
        }}
      />
    </div>
  );
};
