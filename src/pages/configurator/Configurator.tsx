import { useEffect } from "react";
import s from "./Configurator.module.scss";
import { Content } from "./Content/Content";
import { Header } from "./Header/Header";
import { useDispatch } from "react-redux";
import { moveToStartStep } from "../../store/slices/ui/Ui.slice";
import { useUser } from "../../hooks/user";
import { PermissionUser } from "../../utils/userRoleUtils";
import { useNavigate } from "react-router-dom";

export const Configurator: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    if (!user.role.can(PermissionUser.ADD_ROOM)) {
      navigate("/", { replace: true });
      return;
    }
    dispatch(moveToStartStep());
  }, []);

  return (
    <div className={s.container}>
      <Header />
      <Content />
    </div>
  );
};
