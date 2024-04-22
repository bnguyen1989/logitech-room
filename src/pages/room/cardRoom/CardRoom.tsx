import { useNavigate } from "react-router-dom";
import { DownloadSVG, RemoveSVG } from "../../../assets";
import { Button } from "../../../components/Buttons/Button/Button";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import s from "./CardRoom.module.scss";
import { Application } from "../../../models/Application";

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
  const navigate = useNavigate();

  const handleDownload = () => {
    app.downloadRoomCSV(shortId);
  };

  const handleView = () => {
    navigate(`/room/${shortId}`, { replace: true });
  };

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
          <div className={s.button_remove}>
            <IconButton onClick={() => removeRoom(shortId)}>
              <RemoveSVG />
            </IconButton>
          </div>
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
            onClick={handleView}
            text={"View Your Room"}
            variant={"contained"}
          />
        </div>
      </div>
    </div>
  );
};
