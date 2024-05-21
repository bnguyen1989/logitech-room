import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getCardByKeyPermission,
  getTitleCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import { getPrepareSubTitleLangByKeyPermission } from "../../../store/slices/ui/selectors/selectoteLangPage";
import { PrepareCardContainer } from "../PrepareCardContainer/PrepareCardContainer";
import s from "./PrepareSecondaryCard.module.scss";

interface PropsI {
  keyItemPermission: string;
}
export const PrepareSecondaryCard: React.FC<PropsI> = (props) => {
  const { keyItemPermission } = props;
  const activeStep = useAppSelector(getActiveStep);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  const title = useAppSelector(
    getTitleCardByKeyPermission(activeStep, keyItemPermission)
  );
  const subtitle = useAppSelector(
    getPrepareSubTitleLangByKeyPermission(keyItemPermission)
  );

  return (
    <PrepareCardContainer keyItemPermission={keyItemPermission} onSelectedAnalytics={()=>{ console.log("TODO: Record analytics here!")}}>
      <div className={s.container}>
        <div className={s.left_content}>
          <div className={s.image}>
            <img src={card.image} alt="item" />
          </div>
        </div>
        <div className={s.right_content}>
          <div className={s.title}>{title}</div>
          <div className={s.subtitle}>{subtitle}</div>
        </div>
      </div>
    </PrepareCardContainer>
  );
};
