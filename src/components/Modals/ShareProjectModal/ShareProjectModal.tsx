import { useEffect, useState } from "react";
import { ChainLinkSVG, CloseSVG } from "../../../assets";
import { useAppSelector } from "../../../hooks/redux";
import { getShareProjectModalData } from "../../../store/slices/modals/selectors/selectors";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { ModalContainer } from "../ModalContainer/ModalContainer";
import s from "./ShareProjectModal.module.scss";
import { useDispatch } from "react-redux";
import { setShareProjectModal } from "../../../store/slices/modals/Modals.slice";
import { copyToClipboard } from "../../../utils/browserUtils";
import { useUser } from "../../../hooks/user";
import { useUrl } from "../../../hooks/url";
import { Application } from "../../../models/Application";
import {
  EventActionName,
  EventCategoryName,
} from "../../../models/analytics/type";
import { getTKAnalytics } from "../../../utils/getTKAnalytics";
import { ShareType } from "@threekit/rest-api";
import { getShareModalLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";

declare const app: Application;

export const ShareProjectModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen } = useAppSelector(getShareProjectModalData);
  const user = useUser();
  const { getNavLink } = useUrl();
  const [link, setLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const langPage = useAppSelector(getShareModalLangPage);

  useEffect(() => {
    if (!isOpen) {
      setIsCopied(false);
    } else {
      const searchParams = new URLSearchParams();
      searchParams.set("userId", user.id);
      const link = getNavLink("/room", searchParams);
      setLink(link);
    }
  }, [isOpen, user.id]);

  const handleClose = () => {
    dispatch(setShareProjectModal({ isOpen: false }));
  };

  const handleCopy = () => {
    copyToClipboard(link);
    setIsCopied(true);

    getTKAnalytics().share({ shareLink: link, shareType: ShareType.Share });

    app.analyticsEvent({
      category: EventCategoryName.summary_page,
      action: EventActionName.share_project,
      value: {
        link: link,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <ModalContainer>
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.close}>
            <IconButton onClick={handleClose}>
              <CloseSVG />
            </IconButton>
          </div>

          <div className={s.text}>
            <div className={s.icon}>
              <ChainLinkSVG color={"white"} />
            </div>

            <div className={s.title}>{langPage.title}</div>
            <div className={s.subtitle}>{langPage.subtitle}</div>
          </div>
        </div>
        <div className={s.content}>
          <div className={`${s.input} ${isCopied ? s.copied : ""}`}>
            <input type="text" value={link} readOnly />

            <div className={s.button} onClick={handleCopy}>
              <div className={s.button_text}>{langPage.button}</div>
              <div className={s.button_icon}>
                <ChainLinkSVG color={"white"} />
              </div>
            </div>
          </div>
          <div className={s.message}>
            <ChainLinkSVG color={"#C3C6C8"} />
            <div className={s.message_text}>{langPage.labelAfterCopy}</div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
