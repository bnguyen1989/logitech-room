import { CardI } from "../../../store/slices/ui/type";
import s from "./AnnotationProduct.module.scss";
import { AnnotationProductItem } from "./AnnotationProductItem/AnnotationProductItem";
interface PropsI {
  dataAnnotation: {
    title: string;
    card: CardI;
    productName: string;
  }[];
  callbackHandleInfo: (productName: string, card: CardI) => void;
  position?: "top" | "bottom";
}

export const AnnotationProduct: React.FC<PropsI> = (props) => {
  const { dataAnnotation, callbackHandleInfo, position = "bottom" } = props;

  return (
    <div className={`${s.annotationWrap} ${s["annotationWrap_" + position]}`}>
      {dataAnnotation.map((item, index) => (
        <AnnotationProductItem
          key={index}
          title={item.title}
          handleInfo={() => callbackHandleInfo(item.title, item.card)}
        />
      ))}
    </div>
  );
};
