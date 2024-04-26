import React from "react";
import s from "./Header.module.scss";
import { Actions } from "../Actions/Actions";
import { useUser } from "../../../hooks/user";
import { PermissionUser } from "../../../utils/userRoleUtils";

interface PropsI {
  title: string;
}
export const Header: React.FC<PropsI> = (props) => {
  const { title } = props;
  const { user } = useUser();

  const userCanReqConsultation = user.role.can(
    PermissionUser.REQUEST_CONSULTATION
  );

  return (
    <div className={s.container}>
      <div className={s.text}>
        <div className={s.title}>{title}</div>
        <div className={s.subtitle}>
          Configurations are for exploratory purposes only. Room guides and the
          prices listed are based on local MSRP for the products and are not
          formal quotes. Prices may vary by location, channel or reseller.
          {userCanReqConsultation && (
            <span>
              {" "}
              Please <u>request a consultation</u> for more information and next
              steps.
            </span>
          )}
        </div>
      </div>
      <div className={s.buttons}>
        <Actions />
      </div>
    </div>
  );
};
