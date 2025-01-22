import { CSSProperties } from "react";
import s from "./TextDimension.module.scss";
import { HtmlWrapperDimension } from "../HtmlWrapperDimension";
import type { OrientationT } from "../../../../types/mathType";

interface PropsI {
  text: string;
  type?: OrientationT;
  style?: CSSProperties;
}
export const TextDimension: React.FC<PropsI> = (props) => {
  const { text, type, style = {} } = props;

  return (
    <HtmlWrapperDimension>
      <div className={s.container_text_dimension}>
        <div
          style={{
            transform:
              type === "vertical"
                ? "translate(-20%, -50%) rotate(90deg)"
                : "translate(-50%, -140%)",

            ...style,
          }}
          className={s.text_dimension}
        >
          <div className={s.text}>{text}</div>
        </div>
      </div>
    </HtmlWrapperDimension>
  );
};
