import { NavigationMenu } from "../../../components/NavigationMenu/NavigationMenu";
import s from "./Header.module.scss";

interface HeaderIn {
  refHeader?: React.RefObject<HTMLDivElement>;
}
export const Header: React.FC<HeaderIn> = ({ refHeader }) => {
  return (
    <div className={s.container}>
      <div ref={refHeader} className={s.navigationMenu}>
        <NavigationMenu />
      </div>
    </div>
  );
};
