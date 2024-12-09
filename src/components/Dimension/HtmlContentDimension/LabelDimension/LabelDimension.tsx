import s from "./LabelDimension.module.scss";
import { HtmlWrapperDimension } from "../HtmlWrapperDimension";
import type { OrientationT } from "../../../../types/mathType";

interface PropsI {
  text: string;
  type?: OrientationT;
}
export const LabelDimension: React.FC<PropsI> = (props) => {
  const { text, type } = props;

  return (
    <HtmlWrapperDimension>
      <div className={s.container_label_dimension}>
        <div
          style={{
            transform:
              type === "vertical"
                ? "translate(-80%, -50%) rotate(-90deg)"
                : "translate(-50%, -140%)",
          }}
          className={s.label_dimension}
        >
          <div className={s.text}>{text}</div>
        </div>
      </div>
    </HtmlWrapperDimension>
  );
};
