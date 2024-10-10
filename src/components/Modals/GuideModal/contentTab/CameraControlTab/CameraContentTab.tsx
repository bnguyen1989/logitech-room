import { MouseSVG } from "../../../../../assets";
import { TouchSVG } from "../../../../../assets/svg/Touch";
import s from "./CameraControlTab.module.scss";

const data: Record<
  "desktop" | "tablet",
  {
    title: string;
    iconsData: {
      icon: JSX.Element;
      text: string;
    }[];
  }
> = {
  desktop: {
    title: "Camera controls with mouse",
    iconsData: [
      {
        icon: <MouseSVG type="rotate" />,
        text: "Left-click and drag to <b>rotate</b>",
      },
      {
        icon: <MouseSVG type="zoom" />,
        text: "Scroll to <b>zoom</b> in and out",
      },
      {
        icon: <MouseSVG type="pan" />,
        text: "Right-click and drag to <b>pan</b>",
      },
    ],
  },
  tablet: {
    title: "Camera controls with touch",
    iconsData: [
      {
        icon: <TouchSVG type="rotate" />,
        text: "Drag to <b>rotate</b>",
      },
      {
        icon: <TouchSVG type="zoom" />,
        text: "Pinch to <b>zoom</b> in and out",
      },
      {
        icon: <TouchSVG type="pan" />,
        text: "Drag with two fingers to <b>pan</b>",
      },
    ],
  },
};

export const CameraControlTab: React.FC = () => {
  return (
    <>
      {Object.entries(data).map(([key, { title, iconsData }]) => (
        <div className={`${s.cameraControlTab} ${s[key]}`}>
          <div className={s.title}>{title}</div>
          <div className={s.icons_wrapper}>
            {iconsData.map((iconData, index) => (
              <div key={index} className={s.icon_wrapper}>
                {iconData.icon}
                <div
                  className={s.text}
                  dangerouslySetInnerHTML={{ __html: iconData.text }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
