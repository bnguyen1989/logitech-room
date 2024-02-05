import { InformationSVG } from "../../../assets";
import { CardContainer } from "../CardContainer/CardContainer";
import s from "./CardItem.module.scss";
import { ColorItemI, ItemCardI, SelectDataI } from "../../../store/slices/ui/type";
import { ColorItem } from "../../ColorItem/ColorItem";
import { CounterItem } from "../../Counters/CounterItem/CounterItem";
import { SelectItem } from '../../Fields/SelectItem/SelectItem'

interface PropsI {
  active?: boolean;
  recommended?: boolean;
  onClick: () => void;
  data: ItemCardI;
  onChange?: (value: ItemCardI, type: 'counter' | 'color' | 'select') => void;
}
export const CardItem: React.FC<PropsI> = (props) => {
  const { recommended, onClick, data, onChange, active } = props;

  const handleChangeColor = (value: ColorItemI) => {
    if (!onChange || !data.color) {
      return;
    }
    onChange({ ...data, color: { ...data.color, currentColor: value } }, 'color');
  };

  const handleChangeCounter = (value: number) => {
    if (!onChange || !data.counter) {
      return;
    }
    
    onChange({ ...data, counter: { ...data.counter, currentValue: value } }, 'counter');
  };

  const handleChangeSelect = (value: SelectDataI) => {
    if (!onChange || !data.select) {
      return;
    }
    
    onChange({ ...data, select: { ...data.select, value } }, 'select');
  };

  const isAction = !!data.color || !!data.counter || !!data.select;

  return (
    <CardContainer
      onClick={onClick}
      recommended={recommended}
      style={{ padding: "25px 20px" }}
      active={active}
    >
      <div className={s.container}>
        <div className={s.left_content} onClick={onClick}>
          <div className={s.image}>
            <img src={data.image} alt="item" />
          </div>
        </div>
        <div className={s.right_content}>
          <div className={s.header} onClick={onClick}>
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
              {!!data.select && (
                <SelectItem 
                  value={data.select.value}
                  onSelect={handleChangeSelect}
                  options={data.select.data}
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
