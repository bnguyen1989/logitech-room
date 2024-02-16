import { Button } from "../../../components/Buttons/Button/Button";
import s from "./Header.module.scss";

export const Header: React.FC = () => {
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
      </div>
    </div>
  );
};
