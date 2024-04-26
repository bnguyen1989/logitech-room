import { DownloadSVG, RemoveSVG } from "../../../assets";
import { Button } from "../../../components/Buttons/Button/Button";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import s from "./CardRoom.module.scss";
import { Application } from "../../../models/Application";
import { useUrl } from "../../../hooks/url";
import { useUser } from "../../../hooks/user";
import { PermissionUser } from "../../../utils/userRoleUtils";

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
  const { handleNavigate } = useUrl(`/room/${shortId}`);
  const { user } = useUser();

  const handleDownload = () => {
    app.downloadRoomCSV(shortId);
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
              <IconButton onClick={() => removeRoom(shortId)}>
                <RemoveSVG />
              </IconButton>
            </div>
          )}
        </div>
        <div className={s.desc}>{desc}</div>
        <div className={s.buttons}>
          <IconButton
            onClick={handleDownload}
            text={"Download Room Guide"}
            variant={"outlined"}
          >
            <DownloadSVG />
          </IconButton>
          <Button
            onClick={handleNavigate}
            text={"View Your Room"}
            variant={"contained"}
          />
        </div>
      </div>
    </div>
  );
};
