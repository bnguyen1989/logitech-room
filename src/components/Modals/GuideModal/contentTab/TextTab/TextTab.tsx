import s from "./TextTab.module.scss";

interface PropsI {
  title: string;
  subtitle: string;
}
export const TextTab: React.FC<PropsI> = (props) => {
  const { title, subtitle } = props;
  return (
    <div className={s.textTab}>
      <div className={s.title}>{title}</div>
      <div className={s.subtitle}>{subtitle}</div>
    </div>
  );
};
