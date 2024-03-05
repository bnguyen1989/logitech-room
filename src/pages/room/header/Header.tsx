import { useDispatch } from "react-redux";
import { Button } from "../../../components/Buttons/Button/Button";
import s from "./Header.module.scss";
import { setSelectProductModal } from "../../../store/slices/modals/Modals.slice";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShowModalProducts = () => {
    dispatch(setSelectProductModal({ isOpen: true }));
  };

  const handleAnotherRoom = () => {
    navigate("/configurator", { replace: true });
  };

  return (
    <div className={s.container}>
      <div className={s.text}>
        <div className={s.title}>All the rooms you created</div>
        <div className={s.subtitle}>
          Here are all the rooms you created this session. Click through to see
          additional product details per room, or go back to add more rooms.
        </div>
      </div>
      <div className={s.buttons}>
        <Button
          onClick={handleAnotherRoom}
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
