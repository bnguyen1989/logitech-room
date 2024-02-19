import React from "react";
import s from "./Card.module.scss";

interface PropsI {
  image: string;
  title: string;
}
export const Card: React.FC<PropsI> = (props) => {
  const { image, title } = props;
  return (
    <div className={s.container}>
      <div className={s.image}>
        <img src={image} alt={title} />
      </div>
      <div className={s.title}>{title}</div>
    </div>
  );
};
