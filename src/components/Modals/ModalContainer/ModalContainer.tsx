import s from "./ModalContainer.module.scss";

interface PropsI {
  children: React.ReactNode;
  position?: 'center' | 'right'
}
export const ModalContainer: React.FC<PropsI> = (props) => {
  const { children, position='center' } = props;

  return (
    <div className={s.container_screen}>
      <div className={s['container_modal_' + position]}>{children}</div>
    </div>
  );
};
