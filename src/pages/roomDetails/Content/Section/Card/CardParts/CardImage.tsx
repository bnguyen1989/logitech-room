import React from "react";
import s from "../Card.module.scss";

export const CardImage: React.FC<{ image?: string }> = ({ image }) => (
  <div className={s.image}>
    {image && <img src={image} alt="product" />}
  </div>
);
