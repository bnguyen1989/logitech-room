import { NavigationMenu } from "../../../components/NavigationMenu/NavigationMenu";
import s from "./Header.module.scss";

export const Header: React.FC = () => {
  return (
    <div className={s.container}>
      <div className={s.navigationMenu}>
        <NavigationMenu />
      </div>
    </div>
  );
};
