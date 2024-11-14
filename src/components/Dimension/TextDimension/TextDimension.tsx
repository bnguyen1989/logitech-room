import { Html } from "@react-three/drei";
import s from "./TextDimension.module.scss";

interface PropsI {
  text: string;
  type?: "horizontal" | "vertical";
}
export const TextDimension: React.FC<PropsI> = (props) => {
  const { text, type } = props;

  return (
    <Html>
      <div className={s.container_text_dimension}>
        <div
          style={{
            transform:
              type === "vertical"
                ? "translate(-20%, -50%) rotate(90deg)"
                : "translate(-50%, -140%)",
          }}
          className={s.text_dimension}
        >
          <div className={s.text}>{text}</div>
        </div>
      </div>
    </Html>
  );
};
