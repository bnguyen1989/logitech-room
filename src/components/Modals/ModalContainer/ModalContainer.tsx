import s from "./ModalContainer.module.scss";

interface PropsI {
  children: React.ReactNode;
}
export const ModalContainer: React.FC<PropsI> = (props) => {
  const { children } = props;

  return (
    <div className={s.container_screen}>
      <div className={s.container_modal}>{children}</div>
    </div>
  );
};
