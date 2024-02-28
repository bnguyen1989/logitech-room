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
        const dataRooms = res.orders.map((order: OrderI) => {
          return {
            image: ImageRoom,
            title: order.metadata.name,
            desc: order.metadata.description,
            shortId: order.shortId,
          };
        });
        setRooms(dataRooms);
      })
      .finally(() => {
        setIsLoaded(false);
      });
  }, []);
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
      {isLoaded && (
        <div className={s.loader}>
          <Loader />
        </div>
      )}
    </div>
  );
};
