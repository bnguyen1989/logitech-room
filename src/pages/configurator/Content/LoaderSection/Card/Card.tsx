import React from "react";
import s from "./Card.module.scss";
import { useAppSelector } from "../../../../../hooks/redux";
import {
  getCardByKeyPermission,
  getStepNameByKeyPermission,
  getTitleCardByKeyPermission,
} from "../../../../../store/slices/ui/selectors/selectors";

interface PropsI {
  keyItemPermission: string;
}
export const Card: React.FC<PropsI> = (props) => {
  const { keyItemPermission } = props;
  const stepName = useAppSelector(
    getStepNameByKeyPermission(keyItemPermission)
  );
  const card = useAppSelector(
    getCardByKeyPermission(stepName, keyItemPermission)
  );
  const title = useAppSelector(
    getTitleCardByKeyPermission(stepName, keyItemPermission)
  );

  return (
    <div className={s.container}>
      <div className={s.image}>
        <img src={card.image} alt={title} />
      </div>
      <div className={s.title}>{title}</div>
    </div>
  );
};
