import s from "./LabelDimension.module.scss";
import { HtmlWrapperDimension } from "../HtmlWrapperDimension";

interface PropsI {
  text: string;
  type?: "horizontal" | "vertical";
}
export const LabelDimension: React.FC<PropsI> = (props) => {
  const { text, type } = props;

  return (
    <HtmlWrapperDimension>
      <div className={s.container_label_dimension}>
        <div
          style={{
            transform:
              type === "horizontal"
                ? "translate(-20%, -50%) rotate(90deg)"
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
