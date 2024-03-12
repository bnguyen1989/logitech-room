import { CloseSVG } from "../../../assets";
import { useAppSelector } from "../../../hooks/redux";
import { getInfoItemModalData } from "../../../store/slices/modals/selectors/selectors";
import { Button } from "../../Buttons/Button/Button";
import { IconButton } from "../../Buttons/IconButton/IconButton";

import { ModalContainer } from "../ModalContainer/ModalContainer";
import s from "./InfoModal.module.scss";
import ItemImg from "../../../assets/images/items/RallyBar.png";
import { VideoPlayer } from "../../VideoPlayer/VideoPlayer";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setInfoItemModal } from "../../../store/slices/modals/Modals.slice";
import { ColorSwitcher } from "../../ColorSwitchers/ColorSwitcher/ColorSwitcher";

export const InfoModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen } = useAppSelector(getInfoItemModalData);
  const [selectedColor, setSelectedColor] = useState({
    name: "Graphite",
    value: "#434446",
  });

  const cards = [
    {
      image:
        "https://resource.logitech.com/content/dam/logitech/en/products/video-conferencing/rally-bar/buy/rally-bar-feature-secure-setup-1.png",
      title: "SECURE SET UP",
      desc: "Simple, versatile, and meticulously designed for scale, Rally Bar offers clutter-free cable management and multiple mounting options.",
    },
    {
      image:
        "https://resource.logitech.com/content/dam/logitech/en/products/video-conferencing/rally-bar/buy/rally-bar-feature-seen-and-heard.png",
      title: "ENSURE EVERYONE IS SEEN AND HEARD",
      desc: "AI video intelligence, advanced sound pickup, noise suppression, and continuous software improvements provide a clear and natural meeting experience for remote workers.",
    },
    {
      image:
        "https://resource.logitech.com/content/dam/logitech/en/products/video-conferencing/rally-bar/buy/rally-bar-feature-manage-with-sync.png",
      title: "MANAGE REMOTELY WITH SYNC",
      desc: "Monitor room and device health, deploy updates, and modify settings, all from a single cloud-based platform.",
    },
  ];

  const handleClose = () => {
    dispatch(setInfoItemModal({ isOpen: false }));
  };

  if (!isOpen) return null;

  return (
    <ModalContainer>
      <div className={s.container}>
        <div className={s.close_button}>
          <IconButton onClick={handleClose}>
            <CloseSVG color={"white"} />
          </IconButton>
        </div>
        <div className={s.wrapper}>
          <div className={s.item}>
            <div className={s.left_item}>
              <div className={s.image}>
                <img src={ItemImg} alt="image_item" />
              </div>
              <div className={s.viewer}></div>
            </div>
            <div className={s.right_item}>
              <div className={s.text}>
                <div className={s.title}>Rally Bar</div>
                <div className={s.subtitle}>
                  All-in-one video bar for medium to large rooms
                </div>
                <div className={s.desc}>
                  Logitech Rally Bar is the premier video bar for medium to
                  large meeting rooms. Discover remarkably simple, all-in-one
                  video conferencing with brilliant optics & audio.
                </div>
              </div>

              <div className={s.colors}>
                <ColorSwitcher
                  value={selectedColor}
                  onChange={(v) => setSelectedColor(v)}
                  listColors={[
                    {
                      name: "Graphite",
                      value: "#434446",
                    },
                    {
                      name: "White",
                      value: "#FBFBFB",
                    },
                  ]}
                />
              </div>
              <div className={s.button}>
                <Button
                  text={"Add to Room"}
                  onClick={() => {}}
                  variant={"contained"}
                />
              </div>
            </div>
          </div>
          <div className={s.section_video}>
            <div className={s.left_content}>
              <div className={s.title_video}>
                ALL-IN-ONE VIDEO BAR FOR MEDIUM AND LARGE ROOMS
              </div>
              <div className={s.decs_video}>
                Discover remarkably a simple all-in-one video conferencing set
                up with brilliant optics, AI based audio, remote management with
                Sync, and more.
              </div>
            </div>
            <div className={s.right_content}>
              <div className={s.video}>
                <VideoPlayer
                  path={
                    "https://resource.logitech.com/content/dam/logitech/en/products/video-conferencing/rally-bar/buy/rally-bar-overview.mp4"
                  }
                />
              </div>
            </div>
          </div>
          <div className={s.cards}>
            {cards.map((item, index) => (
              <div key={index} className={s.card}>
                <div className={s.image}>
                  <img src={item.image} alt="image" />
                </div>
                <div className={s.text}>
                  <div className={s.title}>{item.title}</div>
                  <div className={s.desc}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={s.button_add_room}>
            <Button
              text={"Add to Room"}
              onClick={() => {}}
              variant={"contained"}
            />
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
