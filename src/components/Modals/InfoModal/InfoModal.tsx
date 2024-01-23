import { useAppSelector } from "../../../hooks/redux";
import { getInfoItemModalData } from "../../../store/slices/modals/selectors/selectors";
import { Button } from "../../Buttons/Button/Button";
import { ColorItem } from "../../ColorItem/ColorItem";
import { ModalContainer } from "../ModalContainer/ModalContainer";
import s from "./InfoModal.module.scss";

export const InfoModal: React.FC = () => {
  const { isOpen } = useAppSelector(getInfoItemModalData);

  if (!isOpen) return null;
	
  return (
    <ModalContainer>
      <div className={s.container}>
        <div className={s.close_button}></div>
        <div className={s.item}>
          <div className={s.left_item}></div>
          <div className={s.right_item}>
            <div className={s.title}></div>
            <div className={s.subtitle}></div>
            <div className={s.desc}></div>
            <div className={s.price}></div>
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
