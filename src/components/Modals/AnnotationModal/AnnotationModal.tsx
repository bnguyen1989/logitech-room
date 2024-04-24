import { CloseSVG } from "../../../assets";
import { useAppSelector } from "../../../hooks/redux";
import {
  getAnnotationModalData,
  getDataForAnnotationModal,
} from "../../../store/slices/modals/selectors/selectors";
import { Button } from "../../Buttons/Button/Button";
import { IconButton } from "../../Buttons/IconButton/IconButton";

import { ModalContainer } from "../ModalContainer/ModalContainer";
import s from "./AnnotationModal.module.scss";
import { VideoPlayer } from "../../VideoPlayer/VideoPlayer";
import { useDispatch } from "react-redux";
import { setAnnotationItemModal } from "../../../store/slices/modals/Modals.slice";
import {
  getLangForModalProduct,
  getLangProductImage,
} from "../../../store/slices/ui/selectors/selectoreLangProduct";
import { ColorSwitcherItem } from "../../ColorSwitchers/ColorSwitcherItem/ColorSwitcherItem";
import { Annotation } from "./AnnotationDataProcces";

export const AnnotationModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, product, card, keyPermission } = useAppSelector(
    getAnnotationModalData
  ) as any;

  const dataProduct: any = useAppSelector(getLangForModalProduct(product));

  const langProductImage = useAppSelector(
    getLangProductImage(product, keyPermission)
  );

  const { isActiveCard, disabledActions, threekitAsset } = useAppSelector(
    getDataForAnnotationModal(keyPermission, card)
  );

  if (!card) return <></>;

  const handleClick = () => {
    const { attributeName } = card.dataThreekit;
    if (isActiveCard && keyPermission) {
      app.removeItem(attributeName, keyPermission);
      return;
    }

    if (!threekitAsset) return;

    app.addItemConfiguration(attributeName, threekitAsset.id, keyPermission);
  };

  if (!dataProduct) return <></>;

  const annotation = new Annotation(dataProduct);

  const featureList2A = annotation.getFeatures("fetures2A");

  const featureList3A = annotation.getFeatures("fetures3A");

  const handleClose = () => {
    dispatch(setAnnotationItemModal({ isOpen: false }));
  };

  if (!isOpen) return null;

  const style2A = annotation.hasGap2(featureList2A) ? s.gap_2_box : s.cards;
  const style3A = annotation.hasGap2(featureList3A) ? s.gap_2_box : s.cards;

  const style2AGrey = !dataProduct["Headline"] ? s.sectionsGrey : "";
  const style3AGrey =
    !dataProduct["Headline"] && !annotation.hasShow(featureList2A)
      ? s.sectionsGrey
      : "";

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
                  <ColorSwitcherItem
                    keyItemPermission={keyPermission}
                    disabled={disabledActions?.color}
                  />
                </div>
                <div className={s.button}>
                  <Button
                    text={!isActiveCard ? "Add to Room" : "Add to Room"}
                    onClick={() => handleClick()}
                    variant={"contained"}
                  />
                </div>
              </div>
            </div>
          )}

          {dataProduct["Headline"] && (
            <div className={`${s.section_video} ${s.sectionsGrey}`}>
              <div className={s.left_content}>
                {dataProduct && dataProduct["Headline"] && (
                  <div className={s.title_video}>{dataProduct["Headline"]}</div>
                )}

                {dataProduct && dataProduct["Description"] && (
                  <div className={s.decs_video}>
                    {dataProduct["Description"]}
                  </div>
                )}
              </div>
              <div className={s.right_content}>
                <div className={s.video}>
                  {dataProduct &&
                    dataProduct["Image|Video"] &&
                    (dataProduct["Image|Video"]["Video"] ? (
                      <VideoPlayer path={dataProduct["Image|Video"]["Video"]} />
                    ) : Object.keys(dataProduct["Image|Video"])[0] ? (
                      <img
                        src={
                          dataProduct["Image|Video"][
                            Object.keys(dataProduct["Image|Video"])[0]
                          ]
                        }
                        alt="image"
                      />
                    ) : null)}
                </div>
              </div>
            </div>
          )}

          {annotation.hasShow(featureList2A) && (
            <div className={`${style2A} ${style2AGrey}`}>
              {featureList2A.map((feature: any) => {
                return (
                  <div key={feature["HeaderFeature"]} className={s.card}>
                    <div className={s.image}>
                      <img src={feature["images"][0]} alt="image" />
                    </div>
                    <div className={s.text}>
                      <div className={s.title}>{feature["HeaderFeature"]}</div>
                      <div className={s.desc}>{feature["KeyFeature"]}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {annotation.hasShow(featureList3A) && (
            <div className={`${style3A} ${style3AGrey}`}>
              {featureList3A.map((feature: any) => {
                return (
                  <div key={feature["HeaderFeature"]} className={s.card}>
                    <div className={s.image}>
                      {feature["images"].length > 0 ? (
                        <img src={feature["images"][0]} alt="image" />
                      ) : (
                        <VideoPlayer path={feature["videos"][0]} />
                      )}
                    </div>
                    <div className={s.text}>
                      <div className={s.title}>{feature["HeaderFeature"]}</div>
                      <div className={s.desc}>{feature["KeyFeature"]}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className={s.button_add_room}>
            <Button
              text={!isActiveCard ? "Add to Room" : "Add to Room"}
              onClick={() => handleClick()}
              variant={"contained"}
            />
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
