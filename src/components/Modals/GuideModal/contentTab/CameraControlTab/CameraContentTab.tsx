import { MouseSVG } from "../../../../../assets";
import { TouchSVG } from "../../../../../assets/svg/Touch";
import { useAppSelector } from "../../../../../hooks/redux";
import { getGuideModalLangPage } from "../../../../../store/slices/ui/selectors/selectoteLangPage";
import s from "./CameraControlTab.module.scss";

export const CameraControlTab: React.FC = () => {
  const langPage = useAppSelector(getGuideModalLangPage);

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
      title: langPage.CameraMouse.title,
      iconsData: [
        {
          icon: <MouseSVG type="rotate" />,
          text: langPage.CameraMouse.Card[0].title,
        },
        {
          icon: <MouseSVG type="zoom" />,
          text: langPage.CameraMouse.Card[1].title,
        },
        {
          icon: <MouseSVG type="pan" />,
          text: langPage.CameraMouse.Card[2].title,
        },
      ],
    },
    tablet: {
      title: langPage.CameraTouch.title,
      iconsData: [
        {
          icon: <TouchSVG type="rotate" />,
          text: langPage.CameraTouch.Card[0].title,
        },
        {
          icon: <TouchSVG type="zoom" />,
          text: langPage.CameraTouch.Card[1].title,
        },
        {
          icon: <TouchSVG type="pan" />,
          text: langPage.CameraTouch.Card[2].title,
        },
      ],
    },
  };

  return (
    <>
      {Object.entries(data).map(([key, { title, iconsData }], index) => (
        <div key={index} className={`${s.cameraControlTab} ${s[key]}`}>
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
