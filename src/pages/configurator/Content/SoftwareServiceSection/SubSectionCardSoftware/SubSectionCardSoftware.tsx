import { SubSoftwareCard } from "../../../../../components/Cards/SubSoftwareCard/SubSoftwareCard";
import s from "./SubSectionCardSoftware.module.scss";

interface PropsI {
  keyPermissionCards: string[];
}
export const SubSectionCardSoftware: React.FC<PropsI> = (props) => {
  const { keyPermissionCards } = props;
  return (
    <div className={s.sub_section_card_software}>
      <div className={s.wrapper_cards}>
        {keyPermissionCards.map((keyPermission, index) => (
          <SubSoftwareCard keyItemPermission={keyPermission} key={index} />
        ))}
      </div>
    </div>
  );
};
