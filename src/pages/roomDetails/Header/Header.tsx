import React from "react";
import s from "./Header.module.scss";
import { Actions } from "../Actions/Actions";
import { useUser } from "../../../hooks/user";
import { PermissionUser } from "../../../utils/userRoleUtils";
import { useAppSelector } from "../../../hooks/redux";
import { getDetailRoomLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";

interface PropsI {
  title: string;
}
export const Header: React.FC<PropsI> = (props) => {
  const { title } = props;
  const user = useUser();
  const langPage = useAppSelector(getDetailRoomLangPage);

  const userCanReqConsultation = user.role.can(
    PermissionUser.REQUEST_CONSULTATION
  );

  return (
    <div className={s.container}>
      <div className={s.text}>
        <div className={s.title}>{title}</div>
        <div className={s.subtitle}>
          {userCanReqConsultation ? langPage.subtitle.v1 : langPage.subtitle.v2}
        </div>
      </div>
      <div className={s.buttons}>
        <Actions />
      </div>
    </div>
  );
};
