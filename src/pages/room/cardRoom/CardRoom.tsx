import { DownloadSVG, RemoveSVG } from "../../../assets";
import { Button } from "../../../components/Buttons/Button/Button";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import s from "./CardRoom.module.scss";
import { Application } from "../../../models/Application";
import { useUrl } from "../../../hooks/url";
import { useUser } from "../../../hooks/user";
import { PermissionUser } from "../../../utils/userRoleUtils";
import {
  EventActionName,
  EventCategoryName,
} from "../../../models/analytics/type";
import { useAppSelector } from "../../../hooks/redux";
import { getRoomsLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";
import { getLocale } from "../../../store/slices/ui/selectors/selectors";

declare const app: Application;

interface PropsI {
  image: string;
  title: string;
  desc: string;
  shortId: string;
  removeRoom: (shortId: string) => void;
}
export const CardRoom: React.FC<PropsI> = (props) => {
  const { image, title, desc, shortId, removeRoom } = props;
  const { handleNavigate } = useUrl();
  const user = useUser();
  const locale = useAppSelector(getLocale);
  const langPage = useAppSelector(getRoomsLangPage);

  const handleDownload = () => {
    app.downloadRoomCSV(shortId, locale || undefined);
    app.analyticsEvent({
      category: EventCategoryName.summary_page,
      action: EventActionName.download_room,
      value: {
        id_room: shortId,
      },
    });
  };

  const handleViewRoom = () => {
    handleNavigate(`/room/${shortId}`);
    app.analyticsEvent({
      category: EventCategoryName.summary_page,
      action: EventActionName.view_room,
      value: {
        id_room: shortId,
        name: title,
      },
    });
  };

  const userCanRemoveRoom = user.role.can(PermissionUser.REMOVE_ROOM);

  return (
    <div className={s.container}>
      <div className={s.left_content}>
        <div className={s.image}>
          <img src={image} alt="image_room" />
        </div>
      </div>
      <div className={s.right_content}>
        <div className={s.header}>
          <div className={s.title}>{title}</div>
          {userCanRemoveRoom && (
            <div className={s.button_remove}>
              <IconButton
                onClick={() => removeRoom(shortId)}
                dataAnalytics={"card-room-remove"}
              >
                <RemoveSVG />
              </IconButton>
            </div>
          )}
        </div>
        <div className={s.desc}>{desc}</div>
        <div className={s.buttons}>
          <IconButton
            onClick={handleDownload}
            text={langPage.card.buttons.DownloadRoomGuide}
            variant={"outlined"}
            dataAnalytics={"card-room-download"}
          >
            <DownloadSVG />
          </IconButton>
          <Button
            onClick={handleViewRoom}
            text={langPage.card.buttons.ViewRoom}
            variant={"contained"}
            dataAnalytics={"card-room-view"}
          />
        </div>
      </div>
    </div>
  );
};
