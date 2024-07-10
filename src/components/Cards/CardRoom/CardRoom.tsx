import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import {
  getPrepareCardTitleLangByKeyPermission,
  getPrepareSubTitleLangByKeyPermission,
} from "../../../store/slices/ui/selectors/selectoteLangPage";
import { PrepareCardContainer } from "../PrepareCardContainer/PrepareCardContainer";
import s from "./CardRoom.module.scss";

interface PropsI {
  keyItemPermission: string;
  onSelectedAnalytics: () => void;
  onClick?: () => void;
}
export const CardRoom: React.FC<PropsI> = (props) => {
  const { keyItemPermission, onClick } = props;
  const activeStep = useAppSelector(getActiveStep);
  const title = useAppSelector(
    getPrepareCardTitleLangByKeyPermission(keyItemPermission)
  );
  const subtitle = useAppSelector(
    getPrepareSubTitleLangByKeyPermission(keyItemPermission)
  );
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );

  return (
    <PrepareCardContainer
      isPadding={false}
      keyItemPermission={keyItemPermission}
      onSelectedAnalytics={props.onSelectedAnalytics}
      onClick={onClick}
    >
      <div className={s.container}>
        <div className={s.image}>
          <img src={card.image} alt={"image"} />
        </div>

        <div className={s.text}>
          <div className={s.subtitle}>{subtitle}</div>
          <div className={s.title}>{title}</div>
        </div>
      </div>
    </PrepareCardContainer>
  );
};
