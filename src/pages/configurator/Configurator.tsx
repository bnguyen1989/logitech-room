import { useEffect } from "react";
import s from "./Configurator.module.scss";
import { Content } from "./Content/Content";
import { Header } from "./Header/Header";
import { useDispatch } from "react-redux";
import { moveToStartStep } from "../../store/slices/ui/Ui.slice";
import { useUser } from "../../hooks/user";
import { PermissionUser } from "../../utils/userRoleUtils";
import { useNavigate } from "react-router-dom";
import { useAnchor } from "../../hooks/anchor";

export const Configurator: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useUser();
  const headerRefAnchor = useAnchor<HTMLDivElement>();

  useEffect(() => {
    if (!user.role.can(PermissionUser.ADD_ROOM)) {
      navigate("/", { replace: true });
      return;
    }
    dispatch(moveToStartStep());
  }, []);

  return (
    <div className={s.container}>
      <Header refHeader={headerRefAnchor.ref} />
      <Content refHeader={headerRefAnchor} />
    </div>
  );
};
