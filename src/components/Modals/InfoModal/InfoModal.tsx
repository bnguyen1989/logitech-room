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

type feature = any;

class Annotation {
  dataProduct: any = {}


  constructor(dataProduct: any) {
    this.dataProduct = dataProduct;
  }

  getImageResource(resourcesLink: string[]): string[] {

    const keyVideoFormat = ".mp4"

    const resources = resourcesLink.filter(
      (link) => !link.includes(keyVideoFormat)
    );

    return resources;
  }
  getVideoResource(resourcesLink: string[]): string[] {

    const keyVideoFormat = ".mp4"

    const resources = resourcesLink.filter(
      (link) => link.includes(keyVideoFormat)
    );

    return resources;
  }


  getFeatureVideos(feature: feature): string[] {
    const keyLinkIMG = 'LinkImgFeature';

    if (!feature.hasOwnProperty(keyLinkIMG)) return []

    const resources: string[] = Object.values(feature["LinkImgFeature"]);

    if (resources.length < 1) return []

    const resourcesImg = this.getVideoResource(resources)

    return resourcesImg;
  }
  getFeatureImages(feature: feature): string[] {
    const keyLinkIMG = 'LinkImgFeature';

    if (!feature.hasOwnProperty(keyLinkIMG)) return []

    const resources: string[] = Object.values(feature["LinkImgFeature"]);

    if (resources.length < 1) return []

    const resourcesImg = this.getImageResource(resources)

    return resourcesImg;
  }


  getFeatures(keyFeature: string): feature[] | [] {
    if (!this.dataProduct.hasOwnProperty(keyFeature)) return []

    const feature = this.dataProduct[keyFeature];
    let featureList = Object.values(feature).sort((feature1: feature, feature2: feature) => feature1.sorting - feature2.sorting);
    featureList = featureList.map(feature => {
      return {
        ...feature,
        images: this.getFeatureImages(feature),
        videos: this.getFeatureVideos(feature)
      }
    })

    return featureList;
  }

  hasShow(featureList: feature[]) {
    return featureList.length > 0
  }
  hasGap2(featureList: feature[]) {
    return featureList.length === 2
  }
  hasGap3(featureList: feature[]) {
    return featureList.length === 3
  }
}

export const InfoModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, product, keyItemPermission } =
    useAppSelector(getInfoItemModalData);
  const [selectedColor, setSelectedColor] = useState<string>("Graphite");

  const dataProduct: any = useAppSelector(getLangForModalProduct(product));
  console.log("dataProduct", dataProduct);

  const langProductImage = useAppSelector(
    getLangProductImage(product, keyItemPermission)
  );

  if (!dataProduct) return <></>;

  const annotation = new Annotation(dataProduct);

  const featureList2A = annotation.getFeatures('fetures2A')

  const featureList3A = annotation.getFeatures('fetures3A')


  const handleClose = () => {
    dispatch(setInfoItemModal({ isOpen: false }));
  };

  if (!isOpen) return null;




  const style2A = annotation.hasGap2(featureList2A) ? s.gap_2_box : s.cards;
  const style3A = annotation.hasGap2(featureList3A) ? s.gap_2_box : s.cards;

  const style2AGrey = !dataProduct['Headline'] ? s.sectionsGrey : '';
  const style3AGrey = !dataProduct['Headline'] && !annotation.hasShow(featureList2A) ? s.sectionsGrey : '';

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
                    onClick={() => { }}
                    variant={"contained"}
                  />
                </div>
              </div>
            </div>
          )}

          {dataProduct["Headline"] && <div className={`${s.section_video} ${s.sectionsGrey}`}>
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
          </div>}

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
                    <div className={s.image}>{feature["images"].length > 0 ? <img src={feature["images"][0]} alt="image" /> : <VideoPlayer path={feature["videos"][0]} />}

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
              text={"Add to Room"}
              onClick={() => { }}
              variant={"contained"}
            />
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
