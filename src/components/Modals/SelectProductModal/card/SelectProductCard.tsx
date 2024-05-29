import { EditSVG } from "../../../../assets";
import { useAppSelector } from "../../../../hooks/redux";
import { getLangProductImage } from "../../../../store/slices/ui/selectors/selectoreLangProduct";
import {
  getCardByKeyPermission,
  getMetadataProductNameAssetFromCard,
  getStepNameByKeyPermission,
  getSubTitleCardByKeyPermission,
  getTitleCardByKeyPermission,
} from "../../../../store/slices/ui/selectors/selectors";
import { IconButton } from "../../../Buttons/IconButton/IconButton";
import s from "./SelectProductCard.module.scss";

interface PropsI {
  keyItemPermission: string;
  callbackEdit?: () => void;
}
export const SelectProductCard: React.FC<PropsI> = (props) => {
  const { keyItemPermission, callbackEdit } = props;
  const stepName = useAppSelector(
    getStepNameByKeyPermission(keyItemPermission)
  );
  const card = useAppSelector(
    getCardByKeyPermission(stepName, keyItemPermission)
  );
  const title = useAppSelector(
    getTitleCardByKeyPermission(stepName, keyItemPermission)
  );
  const subTitle = useAppSelector(
    getSubTitleCardByKeyPermission(stepName, keyItemPermission)
  );

  const productName = useAppSelector(getMetadataProductNameAssetFromCard(card));
  const langProductImage = useAppSelector(
    getLangProductImage(productName, keyItemPermission)
  );

  return (
    <div className={s.container}>
      <div className={s.divider}></div>
      <div className={s.card}>
        <div className={s.left_content}>
          <div className={s.image}>
            <img src={langProductImage} alt={"image"} />
          </div>
        </div>
        <div className={s.right_content}>
          <div className={s.text}>
            <div className={s.header_title}>{card.key}</div>
            <div className={s.title_text}>{title}</div>
            <div className={s.subtitle}>{subTitle}</div>
          </div>
          {callbackEdit && (
            <div className={s.button_edit}>
              <IconButton onClick={callbackEdit}>
                <EditSVG />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
