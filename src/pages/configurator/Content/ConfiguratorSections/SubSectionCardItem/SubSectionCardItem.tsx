import { CardItem } from "../../../../../components/Cards/CardItem/CardItem";
import s from "./SubSectionCardItem.module.scss";

interface PropsI {
  name: string;
  keyPermissionCards: string[];
}
export const SubSectionCardItem: React.FC<PropsI> = (props) => {
  const { name, keyPermissionCards } = props;

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.title}>{name}</div>
        <div className={s.divider}></div>
      </div>
      <div className={s.wrapper_cards}>
        {keyPermissionCards.map((keyPermission, index) => {
          return (
            <CardItem
              key={index}
              keyItemPermission={keyPermission}
              type={"subSection"}
            />
          );
        })}
      </div>
    </div>
  );
};
