import s from "./AnnotationProductItem.module.scss";
import { IconButton } from "../../../Buttons/IconButton/IconButton";
import { InformationSVG } from "../../../../assets";

interface PropsI {
  title: string;
  handleInfo: () => void;
}
export const AnnotationProductItem: React.FC<PropsI> = (props) => {
  const { title, handleInfo } = props;

  return (
    <div className={s.itemAnnotation}>
      <div className={s.labelText}>{title}</div>
      <div className={s.info}>
        <IconButton
          onClick={handleInfo}
          dataAnalytics={"annotation-product-show-annotation-modal"}
        >
          <InformationSVG />
        </IconButton>
      </div>
    </div>
  );
};
