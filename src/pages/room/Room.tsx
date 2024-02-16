import React from "react";
import s from "./Room.module.scss";
import { Header } from "./header/Header";
import ImageRoom from "../../assets/images/pages/room/room.png";
import { CardRoom } from "./cardRoom/CardRoom";

export const Room: React.FC = () => {
  const rooms = [
    {
      image: ImageRoom,
      title: "Large Microsoft Teams Room",
      desc: "A complete room solution is more than the sum of its parts. Including these components will help ensure the overall meeting experience is excellent for participants both in the room and remote.",
    },
    {
      image: ImageRoom,
      title: "Small Huddle Room",
      desc: "A complete room solution is more than the sum of its parts. Including these components will help ensure the overall meeting experience is excellent for participants both in the room and remote.",
    },
    {
      image: ImageRoom,
      title: "Large Zoom Room",
      desc: "A complete room solution is more than the sum of its parts. Including these components will help ensure the overall meeting experience is excellent for participants both in the room and remote.",
    },
  ];
  return (
    <div className={s.container}>
      <Header />

      <div className={s.rooms}>
        {rooms.map((room, index) => (
          <div className={s.wrapper_room} key={index}>
            <div className={s.divider}></div>
            <CardRoom {...room} />
          </div>
        ))}
      </div>
    </div>
  );
};
