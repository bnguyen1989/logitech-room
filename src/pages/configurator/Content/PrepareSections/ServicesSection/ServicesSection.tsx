import { CardContainer } from "../../../../../components/CardContainer/CardContainer";
import s from "./ServicesSection.module.scss";
import ImageAppliance from "../../../../../assets/images/services/appliance.jpg";
import ImagePCBased from "../../../../../assets/images/services/pc_baced.jpg";
import { useState } from "react";

const dataServices: Array<DataServicesI> = [
  {
    image: ImageAppliance,
    title: "Appliance",
    subTitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam quis sapien fringilla, molestie nisl ut, venenatis elit.",
  },
  {
    image: ImagePCBased,
    title: "PC based",
    subTitle:
      "Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris eleifend vitae odio non elementum.",
  },
];

interface DataServicesI {
  image: string;
  title: string;
  subTitle: string;
}

export const ServicesSection: React.FC = () => {
  const [active, setActive] = useState<DataServicesI>();

  const handleClick = (item: DataServicesI) => {
    if (active?.title === item.title) {
      setActive(undefined);
      return;
    }
    setActive(item);
  };

  const isDisabled = (item: DataServicesI) => {
    if (!active) {
      return false;
    }
    return active.title !== item.title;
  };

  return (
    <div className={s.container}>
      {dataServices.map((item, index) => (
        <CardContainer
          key={index}
          onClick={() => handleClick(item)}
          active={active?.title === item.title}
          disabled={isDisabled(item)}
        >
          <div className={s.image}>
            <img src={item.image} alt="" />
          </div>
          <div className={s.text}>
            <div className={s.title}>{item.title}</div>
            <div className={s.subtitle}>{item.subTitle}</div>
          </div>
        </CardContainer>
      ))}
    </div>
  );
};
