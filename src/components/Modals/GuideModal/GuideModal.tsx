import React, { useEffect, useState } from "react";
import s from "./GuideModal.module.scss";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import {
  CameraControlsSVG,
  CloseSVG,
  // DimensionSVG,
  InfoSVG,
  ProductInfoSVG,
} from "../../../assets";
import { CameraControlTab } from "./contentTab/CameraControlTab/CameraContentTab";
import { Actions } from "./actions/Actions";
import { TextTab } from "./contentTab/TextTab/TextTab";
import { ActiveTabI, TabDataI } from "./type";
import { useAppSelector } from "../../../hooks/redux";
import { getDataGuideModal } from "../../../store/slices/modals/selectors/selectors";
import { useDispatch } from "react-redux";
import { setGuideModal } from "../../../store/slices/modals/Modals.slice";
import { getGuideModalLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";

export const GuideModal: React.FC = () => {
  const dispatch = useDispatch();
  const [activeData, setActiveData] = useState<ActiveTabI>({
    tabIndex: 0,
    contentIndex: 0,
  });
  const { isOpen, dataModal } = useAppSelector(getDataGuideModal);
  const langPage = useAppSelector(getGuideModalLangPage);

  const tabs: TabDataI[] = [
    {
      icon: <CameraControlsSVG />,
      contents: [<CameraControlTab />],
    },
    // {
    //   icon: <DimensionSVG />,
    //   contents: [
    //     <TextTab
    //       title={langPage.Dimension.title}
    //       subtitle={langPage.Dimension.subtitle}
    //     />,
    //   ],
    // },
    {
      icon: <ProductInfoSVG />,
      contents: [
        <TextTab
          title={langPage.ProductInfo.title}
          subtitle={langPage.ProductInfo.subtitle}
        />,
      ],
    },
    {
      icon: <InfoSVG />,
      contents: [
        <TextTab
          title={langPage.Interact.title}
          subtitle={langPage.Interact.subtitle}
        />,
      ],
    },
  ];

  const handleClose = () => {
    dispatch(
      setGuideModal({
        isOpen: false,
        dataModal: {
          isFirst: true,
        },
      })
    );
  };

  const handleNext = () => {
    const currentTab = tabs[activeData.tabIndex];
    if (activeData.contentIndex < currentTab.contents.length - 1) {
      const nextContentIndex = activeData.contentIndex + 1;
      setActiveData((prev) => ({
        ...prev,
        contentIndex: nextContentIndex,
      }));
      return;
    }
    const nextTabIndex = activeData.tabIndex + 1;
    if (nextTabIndex >= tabs.length) {
      handleClose();
      return;
    }
    setActiveData({
      tabIndex: nextTabIndex,
      contentIndex: 0,
    });
  };

  const handlePrev = () => {
    if (activeData.contentIndex > 0) {
      const prevContentIndex = activeData.contentIndex - 1;
      if (prevContentIndex < 0) return;
      setActiveData((prev) => ({
        ...prev,
        contentIndex: prevContentIndex,
      }));
      return;
    }
    const prevTabIndex = activeData.tabIndex - 1;
    const prevTab = tabs[prevTabIndex];
    setActiveData({
      tabIndex: prevTabIndex,
      contentIndex: prevTab.contents.length - 1,
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setActiveData({
        tabIndex: 0,
        contentIndex: 0,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      handleNext();
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen, activeData]);

  const getPosition = () => {
    if (activeData.tabIndex === 0 && activeData.contentIndex === 0) {
      return "start";
    }
    if (activeData.tabIndex === tabs.length - 1) {
      return "end";
    }
    return "middle";
  };

  const getHideActions = () => {
    const res: "skip"[] = [];

    if (dataModal?.isFirst) {
      res.push("skip");
    }

    return res;
  };

  if (!isOpen) return null;

  return (
    <div className={s.container_screen}>
      <div className={s.modal}>
        <div className={s.header}>
          <div className={s.close}>
            <IconButton onClick={handleClose}>
              <CloseSVG color={"#ffffff"} />
            </IconButton>
          </div>
        </div>
        <div className={s.content}>
          <div className={s.icon_tabs}>
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`${s.icon_tab} ${
                  index === activeData.tabIndex ? s.icon_tab_active : ""
                }`}
              >
                {tab.icon}
              </div>
            ))}
          </div>
          <div className={s.tab_content}>
            {tabs[activeData.tabIndex].contents[activeData.contentIndex]}
          </div>
          <Actions
            handleNext={handleNext}
            handlePrev={handlePrev}
            handleSkip={handleClose}
            position={getPosition()}
            hideActions={getHideActions()}
          />
        </div>
      </div>
    </div>
  );
};
