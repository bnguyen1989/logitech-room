import { SubSoftwareCard } from "../../../../../components/Cards/SubSoftwareCard/SubSoftwareCard";
import s from "./SubSectionCardSoftware.module.scss";

interface PropsI {
  name: string;
  keyPermissionCards: string[];
}
export const SubSectionCardSoftware: React.FC<PropsI> = (props) => {
  const { keyPermissionCards, name } = props;
  return (
    <div className={s.sub_section_card_software}>
      <div className={s.header}>
        <div className={s.title}>{name}</div>
      </div>
      <div className={s.wrapper_cards}>
        {keyPermissionCards.map((keyPermission, index) => (
          <SubSoftwareCard keyItemPermission={keyPermission} key={index} />
        ))}
      </div>
    </div>
  );
};
