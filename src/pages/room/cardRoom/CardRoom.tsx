import { useNavigate } from "react-router-dom";
import { DownloadSVG, EditSVG } from "../../../assets";
import { Button } from "../../../components/Buttons/Button/Button";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import s from "./CardRoom.module.scss";

interface PropsI {
  image: string;
  title: string;
  desc: string;
}
export const CardRoom: React.FC<PropsI> = (props) => {
  const { image, title, desc } = props;
  const navigate = useNavigate();

  const handleView = () => {
    navigate("/room/1", { replace: true });
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
          <div className={s.button_edit}>
            <IconButton onClick={() => {}}>
              <EditSVG />
            </IconButton>
          </div>
        </div>
        <div className={s.desc}>{desc}</div>
        <div className={s.buttons}>
          <Button onClick={handleView} text={"View"} variant={"contained"} />
          <IconButton onClick={() => {}} text={"Download"} variant={"outlined"}>
            <DownloadSVG />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
