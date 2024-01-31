import { PlatformCardI } from "../../../store/slices/ui/type";
import { CardContainer } from "../CardContainer/CardContainer";
import s from "./CardPlatform.module.scss";

interface PropsI {
  data: PlatformCardI;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}
export const CardPlatform: React.FC<PropsI> = (props) => {
  const { data, onClick, active, disabled } = props;

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

        <div className={s.title}>{data.title}</div>
      </div>
    </CardContainer>
  );
};
