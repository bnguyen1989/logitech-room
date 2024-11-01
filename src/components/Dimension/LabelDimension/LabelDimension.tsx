import { Html } from "@react-three/drei";
import s from "./LabelDimension.module.scss";

interface PropsI {
  text: string;
}
export const LabelDimension: React.FC<PropsI> = (props) => {
  const { text } = props;

  return (
    <Html>
      <div className={s.label_dimension}>
        <div className={s.text}>{text}</div>
      </div>
    </Html>
  );
};
