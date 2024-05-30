import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getCardByKeyPermission,
  getTitleCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import { PrepareCardContainer } from "../PrepareCardContainer/PrepareCardContainer";
import s from "./CardPlatform.module.scss";

interface PropsI {
  keyItemPermission: string;
  onSelectedAnalytics: () => void;
}
export const CardPlatform: React.FC<PropsI> = (props) => {
  const { keyItemPermission } = props;
  const activeStep = useAppSelector(getActiveStep);
  const title = useAppSelector(
    getTitleCardByKeyPermission(activeStep, keyItemPermission)
  );
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );

  return (
    <PrepareCardContainer isPadding={true} keyItemPermission={keyItemPermission} onSelectedAnalytics={props.onSelectedAnalytics}>
      <div className={s.container}>
        <div className={s.logo}>
          <img src={card.logo} alt="logo_ms" />
        </div>

        <div className={s.image}>
          <img src={card.image} alt="image" />
        </div>

        <div className={s.title}>{title}</div>
      </div>
    </PrepareCardContainer>
  );
};
