import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getCardByKeyPermission,
  getTitleCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import { PrepareCardContainer } from "../PrepareCardContainer/PrepareCardContainer";
import s from "./CardService.module.scss";

interface PropsI {
  keyItemPermission: string;
}
export const CardService: React.FC<PropsI> = (props) => {
  const { keyItemPermission } = props;
  const activeStep = useAppSelector(getActiveStep);
  const title = useAppSelector(
    getTitleCardByKeyPermission(activeStep, keyItemPermission)
  );
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );

  return (
    <PrepareCardContainer keyItemPermission={keyItemPermission}>
      <div className={s.container}>
        <div className={s.image}>
          <img src={card.image} alt="" />
        </div>
        <div className={s.text}>
          <div className={s.title}>{title}</div>
          <div className={s.subtitle}>{card.subtitle}</div>
        </div>
      </div>
    </PrepareCardContainer>
  );
};
