import { CardI } from "../../../store/slices/ui/type";
import { CardContainer } from "../CardContainer/CardContainer";
import s from "./CardRoom.module.scss";

interface PropsI {
  data: CardI;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}
export const CardRoom: React.FC<PropsI> = (props) => {
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
          <img src={data.image} alt={"image"} />
        </div>

        <div className={s.text}>
          <div className={s.subtitle}>{data.subtitle}</div>
          {/* <div className={s.title}>{data.title}</div> */}
        </div>
      </div>
    </CardContainer>
  );
};
