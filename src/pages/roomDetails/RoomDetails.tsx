import React from "react";
import s from "./RoomDetails.module.scss";
import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";
import { Content } from "./Content/Content";

export const RoomDetails: React.FC = () => {
  return (
    <div className={s.container}>
      <div className={s.wrapper}>
        <Header />
        <Content />
        <Footer />
      </div>
    </div>
  );
};
