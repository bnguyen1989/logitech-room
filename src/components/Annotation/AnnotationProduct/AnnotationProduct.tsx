import { InformationSVG } from "../../../assets";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import s from "./AnnotationProduct.module.scss";

interface AnnotationProductPropsI {
  annotationText: string;
  onHandleInfo: () => void;
}

export const AnnotationProduct: React.FC<AnnotationProductPropsI> = (
  props: AnnotationProductPropsI
) => {
  const { annotationText, onHandleInfo } = props;
  return (
    <div className={s.annotationWrap}>
      <div className={s.labelText}>{annotationText}</div>
      <div className={s.info}>
        <IconButton onClick={onHandleInfo}>
          <InformationSVG />
        </IconButton>
      </div>
    </div>
  );
};
