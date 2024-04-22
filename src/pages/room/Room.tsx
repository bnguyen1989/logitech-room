import React, { useEffect, useState } from "react";
import s from "./Room.module.scss";
import { Header } from "./header/Header";
import ImageRoom from "../../assets/images/pages/room/room.png";
import { CardRoom } from "./cardRoom/CardRoom";
import { ThreekitService } from "../../services/Threekit/ThreekitService";
import { ConfigData } from "../../utils/threekitUtils";
import { OrderI } from "../../services/Threekit/type";
import { Loader } from "../../components/Loader/Loader";

interface RoomI {
  image: string;
  title: string;
  desc: string;
  shortId: string;
}
export const Room: React.FC = () => {
  const [rooms, setRooms] = useState<Array<RoomI>>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    new ThreekitService()
      .getOrders({ originOrgId: ConfigData.userId })
      .then((res) => {
        const dataRooms = res.orders.reduce<RoomI[]>((acc, order: OrderI) => {
          const { name, description, status } = order.metadata;
          if (status === "deleted") return acc;
          return acc.concat({
            image: ImageRoom,
            title: name,
            desc: description,
            shortId: order.shortId,
          });
        }, []);
        setRooms(dataRooms);
      })
      .finally(() => {
        setIsLoaded(false);
      });
  }, []);

  const removeRoom = (shortId: string) => {
    new ThreekitService().deleteOrder(shortId);
    setRooms((prev) => prev.filter((room) => room.shortId !== shortId));
  };

  return (
    <div className={s.container}>
      <Header />

      <div className={s.rooms}>
        {rooms.map((room, index) => (
          <div className={s.wrapper_room} key={index}>
            <div className={s.divider}></div>
            <CardRoom {...room} removeRoom={removeRoom} />
          </div>
        ))}
      </div>
      {isLoaded && (
        <div className={s.loader}>
          <Loader />
        </div>
      )}
    </div>
  );
};
