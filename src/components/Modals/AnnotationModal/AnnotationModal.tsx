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
import { getCardLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";
import { CameraName } from "../../../utils/permissionUtils";
import { getImageUrl } from "../../../utils/browserUtils";

// Static fallback data for RallyBoard products when threekitAsset data is not available
const getStaticRallyBoardData = (
  keyPermission: string | undefined,
  product?: string | undefined
): any | null => {
  const rallyBoardMountImage = getImageUrl(
    "images/product/rallyboard-wall.jpg"
  );
  const rallyBoardCredenzaImage = getImageUrl(
    "images/product/rallyboard-wall.jpg"
  );

  // Check by keyPermission first
  if (keyPermission === CameraName.RallyBoard || keyPermission === "RallyBoard") {
    return {
      ProductName: "RallyBoard Mount",
      ShortDescription: "Interactive display for wall mounting",
      LongDescription:
        "RallyBoard Mount is an interactive display designed for wall mounting in video conferencing rooms, providing a seamless collaboration experience with space-saving design and optimal viewing angles.",
      Colors: {
        Graphite: rallyBoardMountImage,
      },
      Headline: "WALL-MOUNTED INTERACTIVE DISPLAY",
      Description:
        "RallyBoard Mount offers a space-efficient solution for video conferencing rooms, mounting directly to the wall for optimal use of floor space while maintaining excellent visibility and touch accessibility.",
      "Image|Video": {
        "Image link": rallyBoardMountImage,
      },
      fetures3A: {
        0: {
          HeaderFeature: "SPACE-EFFICIENT DESIGN",
          sorting: "1",
          KeyFeature:
            "Wall-mounted design maximizes floor space while providing a large, interactive display surface for collaboration.",
          LinkImgFeature: {
            "Image link": rallyBoardMountImage,
          },
        },
        1: {
          HeaderFeature: "OPTIMAL VIEWING ANGLES",
          sorting: "2",
          KeyFeature:
            "Designed for comfortable viewing from multiple positions in the room, ensuring everyone can see and interact with the display.",
          LinkImgFeature: {
            "Image link": rallyBoardMountImage,
          },
        },
      },
    };
  }

  if (keyPermission === CameraName.RallyBoardCredenza) {
    return {
      ProductName: "RallyBoard Credenza",
      ShortDescription: "Interactive display for credenza mounting",
      LongDescription:
        "RallyBoard Credenza is an interactive display designed for credenza mounting in video conferencing rooms, offering flexible placement options and enhanced collaboration capabilities.",
      Colors: {
        Graphite: rallyBoardCredenzaImage,
      },
      Headline: "CREDENZA-MOUNTED INTERACTIVE DISPLAY",
      Description:
        "RallyBoard Credenza provides a versatile mounting solution for video conferencing rooms, allowing placement on credenzas or tables for flexible room configurations and easy access.",
      "Image|Video": {
        "Image link": rallyBoardCredenzaImage,
      },
      fetures3A: {
        0: {
          HeaderFeature: "FLEXIBLE PLACEMENT",
          sorting: "1",
          KeyFeature:
            "Credenza mounting allows for flexible room configurations and easy repositioning to accommodate different meeting setups.",
          LinkImgFeature: {
            "Image link": rallyBoardCredenzaImage,
          },
        },
        1: {
          HeaderFeature: "ENHANCED COLLABORATION",
          sorting: "2",
          KeyFeature:
            "Interactive display surface enables seamless collaboration with touch capabilities and optimal viewing angles for all participants.",
          LinkImgFeature: {
            "Image link": rallyBoardCredenzaImage,
          },
        },
      },
    };
  }

  return null;
};

export const AnnotationModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, product, card, keyPermission } = useAppSelector(
    getAnnotationModalData
  ) as any;

  const dataProductFromStore: any = useAppSelector(
    getLangForModalProduct(product)
  );

  // Use static fallback data if no data from store and it's a RallyBoard product
  const staticData = getStaticRallyBoardData(keyPermission);
  
  // Merge static data with store data, prioritizing store data but filling gaps with static data
  let dataProduct: any = dataProductFromStore;
  if (staticData) {
    if (!dataProductFromStore || Object.keys(dataProductFromStore).length === 0) {
      // If no store data, use static data
      dataProduct = staticData;
    } else {
      // If store data exists but is incomplete, merge with static data
      // Check if store data is missing critical fields
      const hasCompleteData = 
        dataProductFromStore["ShortDescription"] &&
        dataProductFromStore["LongDescription"] &&
        dataProductFromStore["Headline"] &&
        dataProductFromStore["Description"];
      
      if (!hasCompleteData) {
        // Merge static data as base, then override with store data
        dataProduct = {
          ...staticData,
          ...dataProductFromStore, // Store data takes priority
        };
      } else {
        // Store data is complete, use it
        dataProduct = dataProductFromStore;
      }
    }
  } else {
    dataProduct = dataProductFromStore;
  }

  console.log("[AnnotationModal] Data check:", {
    product,
    keyPermission,
    cameraNameRallyBoard: CameraName.RallyBoard,
    cameraNameRallyBoardCredenza: CameraName.RallyBoardCredenza,
    keyPermissionMatch: keyPermission === CameraName.RallyBoard || keyPermission === CameraName.RallyBoardCredenza,
    hasDataProductFromStore: !!dataProductFromStore,
    hasStaticData: !!staticData,
    dataProductFromStore,
    staticData,
    finalDataProduct: dataProduct,
    hasProductName: !!dataProduct?.["ProductName"],
    productName: dataProduct?.["ProductName"],
    hasShortDescription: !!dataProduct?.["ShortDescription"],
    shortDescription: dataProduct?.["ShortDescription"],
    hasLongDescription: !!dataProduct?.["LongDescription"],
    hasHeadline: !!dataProduct?.["Headline"],
    headline: dataProduct?.["Headline"],
    hasDescription: !!dataProduct?.["Description"],
    description: dataProduct?.["Description"],
    hasFeatures3A: !!dataProduct?.["fetures3A"],
    features3A: dataProduct?.["fetures3A"],
  });

  const langProductImageFromStore = useAppSelector(
    getLangProductImage(product, keyPermission)
  );

  // Use image from static data if no image from store
  const langProductImage =
    langProductImageFromStore ||
    (staticData?.Colors
      ? (Object.values(staticData.Colors)[0] as string)
      : undefined);

  const { isActiveCard, disabledActions, hiddenActions, threekitAsset } =
    useAppSelector(getDataForAnnotationModal(keyPermission, card));

  const langCard = useAppSelector(getCardLangPage);

  if (!card) return <></>;

  const handleClick = () => {
    const { attributeName } = card.dataThreekit;
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
        <div className={s.header_mobile}>
          <div className={s.close}>
            <IconButton onClick={handleClose}>
              <CloseSVG />
            </IconButton>
          </div>
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
                    hidden={hiddenActions?.color}
                    activeStepProp={card["key"]}
                    dataAnalytics={"annotation-modal-change-color"}
                  />
                </div>
                <div className={s.button}>
                  <Button
                    text={langCard.Text.AddToRoom}
                    onClick={() => handleClick()}
                    variant={"contained"}
                    disabled={isActiveCard}
                    dataAnalytics={"annotation-modal-add-to-room"}
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
            <div>
              <div className={`${style2A} ${style2AGrey}`}>
                {featureList2A.map((feature: any) => {
                  return (
                    <div key={feature["HeaderFeature"]} className={s.card}>
                      <div className={s.image}>
                        <img src={feature["images"][0]} alt="image" />
                      </div>
                      <div className={s.text}>
                        <div className={s.title}>
                          {feature["HeaderFeature"]}
                        </div>
                        <div className={s.desc}>{feature["KeyFeature"]}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {annotation.hasShow(featureList3A) && (
            <div>
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
                        <div className={s.title}>
                          {feature["HeaderFeature"]}
                        </div>
                        <div className={s.desc}>{feature["KeyFeature"]}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className={s.button_add_room}>
            <Button
              text={langCard.Text.AddToRoom}
              onClick={() => handleClick()}
              variant={"contained"}
              disabled={isActiveCard}
              dataAnalytics={"annotation-modal-add-to-room"}
            />
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
