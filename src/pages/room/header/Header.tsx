import { Button } from "../../../components/Buttons/Button/Button";
import s from "./Header.module.scss";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const navigate = useNavigate();

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
      </div>
    </div>
  );
};
