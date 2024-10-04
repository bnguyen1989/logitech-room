import React from "react";
import s from "./GuideModal.module.scss";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import {
  CameraControlsSVG,
  CloseSVG,
  DimensionSVG,
  InfoSVG,
  ProductInfoSVG,
} from "../../../assets";
import { CameraControlTab } from "./contentTab/CameraControlTab/CameraContentTab";
import { Actions } from "./actions/Actions";

const tabs = [
  {
    icon: <CameraControlsSVG />,
  },
  {
    icon: <DimensionSVG />,
  },
  {
    icon: <ProductInfoSVG />,
  },
  {
    icon: <InfoSVG />,
  },
];

export const GuideModal: React.FC = () => {
  const handleClose = () => {};
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
                  index === 2 ? s.icon_tab_active : ""
                }`}
              >
                {tab.icon}
              </div>
            ))}
          </div>
          <div className={s.tab_content}>
            <CameraControlTab type="desktop" />
          </div>
          <Actions />
        </div>
      </div>
    </div>
  );
};
