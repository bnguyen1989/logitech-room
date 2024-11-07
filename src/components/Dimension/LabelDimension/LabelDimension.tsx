import { Html } from "@react-three/drei";
import s from "./LabelDimension.module.scss";

interface PropsI {
  text: string;
  type?: "horizontal" | "vertical";
}
export const LabelDimension: React.FC<PropsI> = (props) => {
  const { text, type } = props;

  return (
    <Html>
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
    </Html>
  );
};
