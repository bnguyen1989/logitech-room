import React, { useEffect } from "react";
import s from "./GetStarted.module.scss";
import { Button } from "../../components/Buttons/Button/Button";
import { useDispatch } from "react-redux";
import { changeRoleUser } from "../../store/slices/user/User.slice";
import { RoleUserName, getRoleByName } from "../../utils/userRoleUtils";
import { copyToClipboard, getImageUrl } from "../../utils/browserUtils";
import { Application } from "../../models/Application";
import {
  EventActionName,
  EventCategoryName,
} from "../../models/analytics/type";
import { getGetStartedLangPage } from "../../store/slices/ui/selectors/selectoteLangPage";
import { useAppSelector } from "../../hooks/redux";
import { useUrl } from "../../hooks/url";
import { IconButton } from "../../components/Buttons/IconButton/IconButton";
import { CopyMarkSVG } from "../../assets";
import { analyticsOptionsShow } from "../../utils/analytics/analyticsOptionsShow";
import { analyticsOptionInteraction } from "../../utils/analytics/analyticsOptionInteraction";
import { analyticsStage } from "../../utils/analytics/analyticsStage";

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

  useEffect(() => {
    analyticsStage({ stageName: EventCategoryName.get_started });
    analyticsOptionsShow({
      optionsSetKey: EventCategoryName.get_started,
      options: [RoleUserName.CUSTOMER,RoleUserName.PARTNER].map(name=> ({
        optionId: name,
        optionName: name,
        optionValue: name
      }))
    });
  }, []);

  
  const handleCustomerClick = () => {
    dispatch(
      changeRoleUser({ role: getRoleByName(RoleUserName.CUSTOMER).getData() })
    );
    handleNavigate("/configurator");
    sendAnalytics();
    analyticsOptionInteraction({
      optionsSetKey: EventCategoryName.get_started,
      optionId: RoleUserName.CUSTOMER
    });

  };
  const handlePartnerClick = () => {
    dispatch(
      changeRoleUser({ role: getRoleByName(RoleUserName.PARTNER).getData() })
    );
    handleNavigate("/configurator");
    sendAnalytics();
    analyticsOptionInteraction({    
      optionsSetKey: EventCategoryName.get_started,
      optionId: RoleUserName.PARTNER
    });
  };

  const handleCopyUrl = () => {
    const url = window.location.href;
    copyToClipboard(url);
  };

  return (
    <div className={s.container}>
      <div className={s.image}>
        <img src={getImageUrl("images/getStarted/banner.png")} alt={"banner"} />
      </div>

      <div className={s.content}>
        <div className={s.text}>
          <div className={s.header_title}>{langPage.subtitle}</div>
          <div className={s.title}>{langPage.title}</div>
        </div>

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

        <div className={s.mobile_link}>
          <div className={s.link_title}>
            This experience is optimized for desktop
          </div>
          <IconButton
            onClick={handleCopyUrl}
            text={"COPY URL"}
            position={"left"}
          >
            <CopyMarkSVG />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
