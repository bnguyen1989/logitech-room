import { useDispatch } from 'react-redux'
import { Button } from "../../../components/Buttons/Button/Button";
import s from "./Header.module.scss";
import { setSelectProductModal } from '../../../store/slices/modals/Modals.slice'

export const Header: React.FC = () => {
  const dispatch = useDispatch();

  const handleShowModalProducts = () => {
    dispatch(setSelectProductModal({ isOpen: true }));
  }
  return (
    <div className={s.container}>
      <div className={s.text}>
        <div className={s.title}>All the rooms you created</div>
        <div className={s.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore.
        </div>
      </div>
      <div className={s.buttons}>
        <Button
          onClick={() => {}}
          text={"Add Another Room"}
          variant={"outlined"}
        />
        <Button
          onClick={() => {}}
          text={"Contact Sales"}
          variant={"contained"}
        />
        <Button
          onClick={handleShowModalProducts}
          text={"Show Products"}
          variant={"contained"}
        />
      </div>
    </div>
  );
};
