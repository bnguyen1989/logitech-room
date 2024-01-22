import React from "react";
import ImagePhonebooth from "../../../../../assets/images/rooms/phonebooth.jpg";
import ImageHundle from "../../../../../assets/images/rooms/huddle.jpg";
import ImageSmall from "../../../../../assets/images/rooms/small.jpg";
import ImageMedium from "../../../../../assets/images/rooms/medium.jpg";
import ImageLarge from "../../../../../assets/images/rooms/large.jpg";
import ImageAuditorium from "../../../../../assets/images/rooms/auditorium.jpg";
import { CardContainer } from "../../../../../components/Cards/CardContainer/CardContainer";
import s from "./RoomSection.module.scss";

const dataRooms: Array<DataRoomI> = [
  {
    image: ImagePhonebooth,
    title: "Phonebooth",
    subTitle: "up to 3",
  },
  {
    image: ImageHundle,
    title: "Huddle Room",
    subTitle: "up to 6",
  },
  {
    image: ImageSmall,
    title: "Small Room",
    subTitle: "up to 8",
  },
  {
    image: ImageMedium,
    title: "Medium Room",
    subTitle: "up to 12",
  },
  {
    image: ImageLarge,
    title: "Large/Boardroom",
    subTitle: "up to 20",
  },
  {
    image: ImageAuditorium,
    title: "Auditorium",
    subTitle: "over 20",
  },
];

interface DataRoomI {
  image: string;
  title: string;
  subTitle: string;
}

export const RoomSection: React.FC = () => {
	const [activeRoom, setActiveRoom] = React.useState<DataRoomI>();

	const handleClick = (item: DataRoomI) => {
		if (activeRoom === item) {
			setActiveRoom(undefined);
			return;
		}
		setActiveRoom(item);
	}

	const isDisabled = (item: DataRoomI) => {
		if (!activeRoom) {
			return false;
		}
		return activeRoom.title !== item.title;
	};
  return (
    <div className={s.container}>
      {dataRooms.map((item, index) => (
        <CardContainer key={index} 
				onClick={() => handleClick(item)}
				active={activeRoom?.title === item.title}
				disabled={isDisabled(item)}

				>
          <div className={s.image}>
            <img src={item.image} alt={item.title} />
          </div>

          <div className={s.text}>
            <div className={s.subtitle}>{item.subTitle}</div>
            <div className={s.title}>{item.title}</div>
          </div>
        </CardContainer>
      ))}
    </div>
  );
};
