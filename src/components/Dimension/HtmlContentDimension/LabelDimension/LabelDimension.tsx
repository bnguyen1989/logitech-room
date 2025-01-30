import s from "./LabelDimension.module.scss";
import { HtmlWrapperDimension } from "../HtmlWrapperDimension";
import type { OrientationT } from "../../../../types/mathType";

interface PropsI {
  text: string;
  type?: OrientationT;
  offset?: boolean;
}
export const LabelDimension: React.FC<PropsI> = (props) => {
  const { text, type, offset } = props;

  const style = offset
    ? {
        transform:
          type === "vertical"
            ? "translate(-80%, -50%) rotate(-90deg)"
            : "translate(-50%, -140%)",
      }
    : {};
  return (
    <HtmlWrapperDimension>
      <div className={s.container_label_dimension}>
        <div style={style} className={s.label_dimension}>
          <div className={s.text}>{text}</div>
        </div>
      </div>
    </HtmlWrapperDimension>
  );
};
