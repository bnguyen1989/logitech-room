import { SubSoftwareCard } from "../../../../../components/Cards/SubSoftwareCard/SubSoftwareCard";
import { useAppSelector } from "../../../../../hooks/redux";
import {
  getActiveStep,
  getIsSelectedCardByKeyPermission,
} from "../../../../../store/slices/ui/selectors/selectors";
import s from "./SubSectionCardSoftware.module.scss";

interface PropsI {
  name: string;
  keyPermissionCards: string[];
  parentKeyPermission: string;
}
export const SubSectionCardSoftware: React.FC<PropsI> = (props) => {
  const { parentKeyPermission, keyPermissionCards, name } = props;

  const activeStep = useAppSelector(getActiveStep);
  const isActiveCard = useAppSelector(
    getIsSelectedCardByKeyPermission(activeStep, parentKeyPermission)
  );
  return (
    <div
      className={`${s.sub_section_card_software} ${
        !isActiveCard ? s.disabled : ""
      }`}
    >
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
