import { ServiceCardI } from "../../../store/slices/ui/type";
import { CardContainer } from "../CardContainer/CardContainer";
import s from "./CardService.module.scss";

interface PropsI {
  data: ServiceCardI;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}
export const CardService: React.FC<PropsI> = (props) => {
  const { data, onClick, active, disabled } = props;
  return (
    <CardContainer
      onClick={onClick}
      active={active}
      disabled={disabled}
      isFullClick
    >
      <div className={s.container}>
        <div className={s.image}>
          <img src={data.image} alt="" />
        </div>
        <div className={s.text}>
          <div className={s.title}>{data.title}</div>
          <div className={s.subtitle}>{data.subtitle}</div>
        </div>
      </div>
    </CardContainer>
  );
};
