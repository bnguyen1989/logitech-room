import React from "react";
import s from "./Actions.module.scss";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { DownloadSVG, ListSVG, RevertSVG, ShareSVG } from "../../../assets";
import { Button } from "../../../components/Buttons/Button/Button";
import { useNavigate } from "react-router-dom";

export const Actions: React.FC = () => {
  const navigate = useNavigate();
  const handlerBack = () => {
    navigate("/room", { replace: true });
  };

  const handlerStartOver = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className={s.container}>
      <IconButton text={"Back"} onClick={handlerBack} variant={"outlined"}>
        <ListSVG />
      </IconButton>
      <IconButton text={"Download"} onClick={() => {}} variant={"outlined"}>
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
