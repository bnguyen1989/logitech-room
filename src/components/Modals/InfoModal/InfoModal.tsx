import { CloseSVG } from '../../../assets'
import { useAppSelector } from "../../../hooks/redux";
import { getInfoItemModalData } from "../../../store/slices/modals/selectors/selectors";
import { Button } from "../../Buttons/Button/Button";
import { IconButton } from '../../Buttons/IconButton/IconButton'
import { ColorItem } from "../../ColorItem/ColorItem";
import { ModalContainer } from "../ModalContainer/ModalContainer";
import s from "./InfoModal.module.scss";
import ItemImg from '../../../assets/images/items/camera.jpg'

export const InfoModal: React.FC = () => {
  const { isOpen } = useAppSelector(getInfoItemModalData);

  if (!isOpen) return null;
	
  return (
    <ModalContainer>
      <div className={s.container}>
        <div className={s.close_button}>
          <IconButton onClick={() => {}}>
            <CloseSVG />
          </IconButton>
        </div>
        <div className={s.item}>
          <div className={s.left_item}>
            <div className={s.image}>
              <img src={ItemImg} alt="image_item" />
            </div>
            <div className={s.viewer}></div>
          </div>
          <div className={s.right_item}>
            <div className={s.title}>Rally Bar</div>
            <div className={s.subtitle}>All-in-one video bar for medium to large rooms</div>
            <div className={s.desc}>Logitech Rally Bar is the premier video bar for medium to large meeting rooms. Discover remarkably simple, all-in-one video conferencing with brilliant optics & audio.</div>
            <div className={s.price}>$3,900.00</div>
            <ColorItem
              value={{
                name: "Graphite",
                value: "#434446",
              }}
              onChange={() => {}}
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
            <Button
              text={"Add to your bundle"}
              onClick={() => {}}
              variant={"contained"}
            />
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
