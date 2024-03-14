import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import { getTitleFromDataByKeyPermission } from "../../../store/slices/ui/utils";
import { PrepareCardContainer } from "../PrepareCardContainer/PrepareCardContainer";
import s from "./CardRoom.module.scss";

interface PropsI {
  keyItemPermission: string;
}
export const CardRoom: React.FC<PropsI> = (props) => {
  const { keyItemPermission } = props;
  const activeStep = useAppSelector(getActiveStep);
  const title = getTitleFromDataByKeyPermission(keyItemPermission);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );

  return (
    <PrepareCardContainer keyItemPermission={keyItemPermission}>
      <div className={s.container}>
        <div className={s.image}>
          <img src={card.image} alt={"image"} />
        </div>

        <div className={s.text}>
          <div className={s.subtitle}>{card.subtitle}</div>
          <div className={s.title}>{title}</div>
        </div>
      </div>
    </PrepareCardContainer>
  );
};
