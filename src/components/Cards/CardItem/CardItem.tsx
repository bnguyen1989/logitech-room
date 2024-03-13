import { InformationSVG } from "../../../assets";
import { CardContainer } from "../CardContainer/CardContainer";
import s from "./CardItem.module.scss";
import { ColorSwitcherItem } from "../../ColorSwitchers/ColorSwitcherItem/ColorSwitcherItem";
import { CounterItem } from "../../Counters/CounterItem/CounterItem";
import { SelectItem } from "../../Fields/SelectItem/SelectItem";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { useDispatch } from "react-redux";
import { setInfoItemModal } from "../../../store/slices/modals/Modals.slice";
import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getCardByKeyPermission,
  getIsSelectedCardByKeyPermission,
  getTitleCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";

interface PropsI {
  keyItemPermission: string;
  onClick: () => void;
}
export const CardItem: React.FC<PropsI> = (props) => {
  const { keyItemPermission, onClick } = props;
  const activeStep = useAppSelector(getActiveStep);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  const isActiveCard = useAppSelector(
    getIsSelectedCardByKeyPermission(activeStep, keyItemPermission)
  );
  const title = useAppSelector(
    getTitleCardByKeyPermission(activeStep, keyItemPermission)
  );
  const dispatch = useDispatch();

  if (!card) return null;

  const handleInfo = () => {
    dispatch(setInfoItemModal({ isOpen: true }));
  };

  // const isAction = card.counter || card.color || card.select;
  const isAction = card.counter || card.select;

  return (
    <CardContainer
      onClick={onClick}
      recommended={card.recommended}
      style={{ padding: "25px 20px" }}
      active={isActiveCard}
    >
      <div className={s.container}>
        <div className={s.left_content} onClick={onClick}>
          <div className={s.image}>
            <img src={card.image} alt="item" />
          </div>
        </div>
        <div className={s.right_content}>
          <div className={s.header} onClick={onClick}>
            {/* <div className={s.header_title}>{card.header_title}</div> */}
            <div className={s.title}>{title}</div>
            {!!card.subtitle && (
              <div className={s.subtitle}>{card.subtitle}</div>
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
              <ColorSwitcherItem keyItemPermission={card.keyPermission} />
              <CounterItem
                keyItemPermission={card.keyPermission}
                disabled={!isActiveCard}
              />
              <SelectItem
                keyItemPermission={card.keyPermission}
                disabled={!isActiveCard}
              />
            </div>
            <div className={s.info}>
              <IconButton onClick={handleInfo}>
                <InformationSVG />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};
