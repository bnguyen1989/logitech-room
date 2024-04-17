import React from "react";
import s from "./Actions.module.scss";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { DownloadSVG, ListSVG, RevertSVG, ShareSVG } from "../../../assets";
import { Button } from "../../../components/Buttons/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { Application } from "../../../models/Application";

declare const app: Application;

export const Actions: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const handlerBack = () => {
    navigate("/room", { replace: true });
  };

  const handlerStartOver = () => {
    navigate("/", { replace: true });
  };

  const handlerDownload = () => {
    if (!roomId) return;
    app.downloadRoomCSV(roomId);
  };

  return (
    <div className={s.container}>
      <IconButton text={"Back"} onClick={handlerBack} variant={"outlined"}>
        <ListSVG />
      </IconButton>
      <IconButton
        text={"Download"}
        onClick={handlerDownload}
        variant={"outlined"}
      >
        <DownloadSVG />
      </IconButton>
      <IconButton text={"Share"} onClick={() => {}} variant={"outlined"}>
        <ShareSVG />
      </IconButton>
      <Button
        onClick={() => {}}
        text={"Contact Sales"}
        variant={"contained"}
        style={{
          padding: "19px 40px",
        }}
      />
      <IconButton text={"Start over"} onClick={handlerStartOver}>
        <RevertSVG />
      </IconButton>
    </div>
  );
};
