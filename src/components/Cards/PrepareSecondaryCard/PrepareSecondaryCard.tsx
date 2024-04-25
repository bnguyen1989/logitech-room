import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getCardByKeyPermission,
  getTitleCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import { PrepareCardContainer } from "../PrepareCardContainer/PrepareCardContainer";
import s from "./PrepareSecondaryCard.module.scss";

interface PropsI {
  keyItemPermission: string;
}
export const PrepareSecondaryCard: React.FC<PropsI> = (props) => {
  const { keyItemPermission } = props;
  const activeStep = useAppSelector(getActiveStep);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  const title = useAppSelector(
    getTitleCardByKeyPermission(activeStep, keyItemPermission)
  );

  return (
    <PrepareCardContainer keyItemPermission={keyItemPermission}>
      <div className={s.container}>
        <div className={s.left_content}>
          <div className={s.image}>
            <img src={card.image} alt="item" />
          </div>
        </div>
        <div className={s.right_content}>
          <div className={s.title}>{title}</div>
          <div className={s.subtitle}>{card.subtitle}</div>
        </div>
      </div>
    </PrepareCardContainer>
  );
};
