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
import {
  getLangForModalProduct,
  getLangProductImage,
  // getLangProductImage,
} from "../../../store/slices/ui/selectors/selectoreLangProduct";

export const InfoModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, product, keyItemPermission } =
    useAppSelector(getInfoItemModalData);
  const [selectedColor, setSelectedColor] = useState<string>("Graphite");
 
  const dataProduct: any = useAppSelector(getLangForModalProduct(product));
  console.log("dataProduct",dataProduct);

  const langProductImage = useAppSelector(
    getLangProductImage(product, keyItemPermission)
  );

  if (!dataProduct) return <></>;

  const fetures2A = dataProduct.fetures2A ? dataProduct.fetures2A : [];
  const feturesList2A: any = Object.values(fetures2A).sort(
    (a: any, b: any) => a.sorting - b.sorting
  );
  const fetures3A = dataProduct.fetures3A ? dataProduct.fetures3A : [];
  const feturesList3A: any = Object.values(fetures3A).sort(
    (a: any, b: any) => a.sorting - b.sorting
  );
 
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
          {dataProduct && (
            <div className={s.item}>
              <div className={s.left_item}>
                <div className={s.image}>
                  <img src={langProductImage} alt="image_item" />
                </div>
                <div className={s.viewer}></div>
              </div>
              <div className={s.right_item}>
                <div className={s.text}>
                  {dataProduct && dataProduct["ProductName"] && (
                    <div className={s.title}>{dataProduct["ProductName"]}</div>
                  )}

                  {dataProduct && dataProduct["ShortDescription"] && (
                    <div className={s.subtitle}>
                      {dataProduct["ShortDescription"]}
                    </div>
                  )}
                  {dataProduct && dataProduct["LongDescription"] && (
                    <div className={s.desc}>
                      {dataProduct["LongDescription"]}
                    </div>
                  )}
                </div>

                <div className={s.colors}>
                  <ColorSwitcher
                    value={selectedColor}
                    onChange={(v) => setSelectedColor(v.name)}
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
          )}

          <div className={s.section_video}>
            <div className={s.left_content}>
              {dataProduct && dataProduct["Headline"] && (
                <div className={s.title_video}>{dataProduct["Headline"]}</div>
              )}

              {dataProduct && dataProduct["Description"] && (
                <div className={s.decs_video}>{dataProduct["Description"]}</div>
              )}
            </div>
            <div className={s.right_content}>
              <div className={s.video}>
                {dataProduct &&
                  dataProduct["Image|Video"] &&
                  dataProduct["Image|Video"]["Video"] && (
                    <VideoPlayer path={dataProduct["Image|Video"]["Video"]} />
                  )}
              </div>
            </div>
          </div>
          {feturesList2A.length > 0 && (
            <div className={s.cards}>
              {feturesList2A.map((card: any) => {
                const images = Object.values(card["LinkImgFeature"]).filter(
                  (link) => !link.includes(".mp4")
                );

                return (
                  <div key={card["HeaderFeature"]} className={s.card}>
                    <div className={s.image}>
                      <img src={images[0]} alt="image" />
                    </div>
                    <div className={s.text}>
                      <div className={s.title}>{card["HeaderFeature"]}</div>
                      <div className={s.desc}>{card["KeyFeature"]}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {feturesList3A.length > 0 && (
            <div className={s.cards}>
              {feturesList3A.map((card: any) => {
                const images = Object.values(card["LinkImgFeature"]).filter(
                  (link) => !link.includes(".mp4")
                );

                return (
                  <div key={card["HeaderFeature"]} className={s.card}>
                    <div className={s.image}>
                      <img src={images[0]} alt="image" />
                    </div>
                    <div className={s.text}>
                      <div className={s.title}>{card["HeaderFeature"]}</div>
                      <div className={s.desc}>{card["KeyFeature"]}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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
