import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getTitleCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import { CardI } from "../../../store/slices/ui/type";
import { CardContainer } from "../CardContainer/CardContainer";
import s from "./CardPlatform.module.scss";

interface PropsI {
  data: CardI;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}
export const CardPlatform: React.FC<PropsI> = (props) => {
  const { data, onClick, active, disabled } = props;
  const activeStep = useAppSelector(getActiveStep);
  const title = useAppSelector(
    getTitleCardByKeyPermission(activeStep, data.keyPermission)
  );

  return (
    <CardContainer
      onClick={onClick}
      active={active}
      disabled={disabled}
      isFullClick
    >
      <div className={s.container}>
        <div className={s.logo}>
          <img src={data.logo} alt="logo_ms" />
        </div>

        <div className={s.image}>
          <img src={data.image} alt="image" />
        </div>

        <div className={s.title}>{title}</div>
      </div>
    </CardContainer>
  );
};
