import React from "react";
import s from "./GetStarted.module.scss";
import { Button } from "../../components/Buttons/Button/Button";
import { useDispatch } from "react-redux";
import { changeRoleUser } from "../../store/slices/user/User.slice";
import { RoleUserName, getRoleByName } from "../../utils/userRoleUtils";
import { getImageUrl } from "../../utils/browserUtils";
import { Application } from "../../models/Application";
import {
  EventActionName,
  EventCategoryName,
} from "../../models/analytics/type";
import { getGetStartedLangPage } from "../../store/slices/ui/selectors/selectoteLangPage";
import { useAppSelector } from "../../hooks/redux";
import { useUrl } from "../../hooks/url";

declare const app: Application;

export const GetStarted: React.FC = () => {
  const dispatch = useDispatch();
  const langPage = useAppSelector(getGetStartedLangPage);
  const { handleNavigate } = useUrl();

  const sendAnalytics = () => {
    app.analyticsEvent({
      category: EventCategoryName.get_started,
      action: EventActionName.chose_type_user,
      value: {},
    });
  };

  const handleCustomerClick = () => {
    dispatch(
      changeRoleUser({ role: getRoleByName(RoleUserName.CUSTOMER).getData() })
    );
    handleNavigate("/configurator");
    sendAnalytics();
  };
  const handlePartnerClick = () => {
    dispatch(
      changeRoleUser({ role: getRoleByName(RoleUserName.PARTNER).getData() })
    );
    handleNavigate("/configurator");
    sendAnalytics();
  };

  return (
    <div className={s.container}>
      <div className={s.image}>
        <img src={getImageUrl("images/getStarted/banner.png")} alt={"banner"} />
      </div>

      <div className={s.content}>
        <div className={s.header_title}>{langPage.subtitle}</div>
        <div className={s.title}>{langPage.title}</div>

        <div className={s.description}>
          <div className={s.block}>
            <div className={s.block_title}>{langPage.list.title}</div>

            <ul className={s.block_list}>
              <li>{langPage.list["0"]}</li>
              <li>{langPage.list["1"]}</li>
              <li>{langPage.list["2"]}</li>
            </ul>
          </div>
        </div>

        <div className={s.type_user}>
          <div className={s.type_user_buttons}>
            <Button
              text={langPage.Btn.customer}
              variant="contained"
              onClick={handleCustomerClick}
            />
            <Button
              text={langPage.Btn.partner}
              variant="outlined"
              onClick={handlePartnerClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
