import { InformationSVG } from "../../../assets";
import { CardContainer } from "../CardContainer/CardContainer";
import s from "./CardItem.module.scss";
import { ColorItemI, ItemCardI } from "../../../store/slices/ui/type";
import { ColorItem } from "../../ColorItem/ColorItem";
import { CounterItem } from "../../Counters/CounterItem/CounterItem";

interface PropsI {
  active?: boolean;
  recommended?: boolean;
  onClick: () => void;
  data: ItemCardI;
  onChange?: (value: ItemCardI) => void;
}
export const CardItem: React.FC<PropsI> = (props) => {
  const { recommended, onClick, data, onChange, active } = props;

  const handleChangeColor = (value: ColorItemI) => {
    if (!onChange || !data.color) {
      return;
    }
    onChange({ ...data, color: { ...data.color, currentColor: value } });
  };

  const handleChangeCounter = (value: number) => {
    if (!onChange || !data.counter) {
      return;
    }
    
    onChange({ ...data, counter: { ...data.counter, currentValue: value } });
  };

  const isAction = !!data.color || !!data.counter;

  return (
    <CardContainer
      onClick={onClick}
      recommended={recommended}
      style={{ padding: "25px 20px" }}
      active={active}
    >
      <div className={s.container}>
        <div className={s.left_content}>
          <div className={s.image}>
            <img src={data.image} alt="item" />
          </div>
        </div>
        <div className={s.right_content}>
          <div className={s.header}>
            <div className={s.header_title}>{data.header_title}</div>
            <div className={s.title}>{data.title}</div>
            {!!data.subtitle && (
              <div className={s.subtitle}>{data.subtitle}</div>
            )}
          </div>
          <div
            className={s.content}
            style={{ borderTop: isAction ? "1px solid #E1E2E3" : "" }}
          >
            <div
              className={s.content_actions}
              style={{ paddingTop: isAction ? "20px" : "" }}
            >
              {!!data.color && (
                <ColorItem
                  value={data.color.currentColor}
                  listColors={data.color.colors}
                  onChange={handleChangeColor}
                />
              )}
              {!!data.counter && (
                <CounterItem
                  value={data.counter.currentValue}
                  onChange={handleChangeCounter}
                  min={data.counter.min}
                  max={data.counter.max}
                />
              )}
            </div>
            <div className={s.info}>
              <InformationSVG />
            </div>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};
