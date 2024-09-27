import React, { useEffect, useState } from "react";
import s from "./RoomDetails.module.scss";
import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";
import { Content } from "./Content/Content";
import { useParams } from "react-router-dom";
import { ThreekitService } from "../../services/Threekit/ThreekitService";
import { SectionI } from "./type";
import { Loader } from "../../components/Loader/Loader";
import { CardI } from "../../store/slices/ui/type";
import { getFormattingNameColor, StepName } from "../../utils/baseUtils";
import { ImageGallery } from "../../components/ImageGallery/ImageGallery";
import {
  isBundleElement,
  isCameraElement,
  isTapElement,
} from "../../utils/permissionUtils";
import { useAppSelector } from "../../hooks/redux";
import {
  getCardLangPage,
  getDetailRoomLangPage,
} from "../../store/slices/ui/selectors/selectoteLangPage";
import { getFormatName } from "../../components/Cards/CardSoftware/CardSoftware";
import { PriceService } from "../../services/PriceService/PriceService";
import { isShowPriceByLocale } from "../../utils/productUtils";

export const RoomDetails: React.FC = () => {
  const { roomId } = useParams();
  const [sections, setSections] = useState<Array<SectionI>>([]);
  const [nameRoom, setNameRoom] = useState<string>("");
  const [formatTotalAmount, setFormatTotalAmount] = useState<
    string | undefined
  >();
  const [images, setImages] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const langPage = useAppSelector(getDetailRoomLangPage);

  const langCard = useAppSelector(getCardLangPage);

  const getTitleSectionOrderByStepName = (
    stepName: StepName | "Room Solution Bundles"
  ) => {
    switch (stepName) {
      case StepName.ConferenceCamera:
      case StepName.AudioExtensions:
      case StepName.MeetingController:
      case StepName.VideoAccessories:
      case StepName.SoftwareServices:
      case "Room Solution Bundles":
        return langPage.StepName[stepName];
      default:
        return "";
    }
  };

  const getFormatPrice = (currency: string) => (price: number) => {
    const formattedCurrency = currency.toUpperCase();

    return new PriceService().formatPrice(price, formattedCurrency);
  };

  useEffect(() => {
    setIsLoaded(true);
    new ThreekitService()
      .getOrders({ shortId: roomId })
      .then(async (res) => {
        const [room] = res.orders;
        if (!room) return;
        setNameRoom(room.metadata.name);

        const snapshots = JSON.parse(room.metadata.snapshots);
        if (snapshots) {
          setImages([snapshots.Front, snapshots.Left]);
        }

        const locale = (room.metadata["locale"] as any) ?? {
          currencyLocale: "en-US",
          currency: "USD",
        };

        const formatPrice = getFormatPrice(locale.currency);
        const isShowPrice = isShowPriceByLocale(locale.currencyLocale);
        const dataSections: Array<SectionI> = [];

        const getLabelValue = (selectValue?: string) => {
          if (selectValue?.includes("Years")) {
            return getFormatName(langCard)(selectValue);
          }

          return selectValue;
        };

        const bundleElement = room.cart.find((item) =>
          isBundleElement(JSON.parse(item.metadata.data).keyPermission)
        );

        const isContainBundle = !!bundleElement;
        let isBundleTapIp = false;

        return (async () => {
          let totalAmount = 0;
          for (const item of room.cart) {
            const {
              data,
              color,
              count,
              title,
              sku: defaultSku,
              description,
              selectValue,
            } = item.metadata;
            let sku = defaultSku;
            const card = JSON.parse(data) as CardI;

            const isBundleCard = isBundleElement(card.keyPermission);

            let keySection: any = card.key;
            const isCamera = isCameraElement(card.keyPermission);
            const isTap = isTapElement(card.keyPermission);

            let dataProduct = await new PriceService().getDataProductBySku(sku);
            // const inStock = dataProduct.inStock ?? true;
            const inStock = true; // temp solution, description in Pull Request

            let cardFromBundle = false;
            if (
              isContainBundle &&
              (isCamera || (isTap && parseInt(count) === 1 && !isBundleTapIp))
            ) {
              if (isTap) {
                isBundleTapIp = true;
              }
              keySection = "Room Solution Bundles";
              sku = bundleElement.metadata.sku;
              dataProduct = await new PriceService().getDataProductBySku(sku);
              cardFromBundle = true;
            }

            const titleSection = getTitleSectionOrderByStepName(keySection);
            const sectionId = dataSections.findIndex(
              (section) => section.title === titleSection
            );

            const priceNumber = dataProduct.price ?? 0.0;
            const strikeThroughPrice = dataProduct.strikeThroughPrice;
            const amountNumber = priceNumber * parseInt(count);
            if (!cardFromBundle) totalAmount += amountNumber;

            const amount = formatPrice(priceNumber);
            const isContactReseller = isShowPrice && amountNumber === 0;

            let itemSection: SectionI = {
              title: titleSection,
              data: [
                {
                  title: title,
                  subtitle: description ?? "",
                  image: card.image ?? "",
                  selectValue: selectValue,
                  labelValue: getLabelValue(selectValue),
                  inStock,
                  priceData: {
                    amount: isShowPrice ? amount : undefined,
                    strikeThroughPrice: strikeThroughPrice
                      ? formatPrice(strikeThroughPrice)
                      : undefined,
                    isContactReseller,
                  },
                },
              ],
              typeSection: keySection,
            };

            if (card.key !== StepName.SoftwareServices) {
              let formatColor = getFormattingNameColor(color)(langCard);
              if (formatColor) {
                formatColor += " : ";
              }

              const isDisplayColor =
                !!formatColor &&
                Object.values(card.dataThreekit.threekitItems).length > 1;

              const partNumber = `${isDisplayColor ? formatColor : ""}${
                isBundleCard ? sku + "*" : sku
              }`;

              itemSection = {
                ...itemSection,
                data: [
                  {
                    ...itemSection.data[0],
                    partNumber,
                    count: count
                  },
                ],
              };
            }

            if (isBundleCard) continue;

            if (sectionId === -1) {
              dataSections.push(itemSection);
            } else {
              dataSections[sectionId].data.push(itemSection.data[0]);
            }
          }
          return totalAmount;
        })().then((totalAmount) => {
          setSections(dataSections);
          if (isShowPrice) setFormatTotalAmount(formatPrice(totalAmount));
        });
      })
      .finally(() => {
        setIsLoaded(false);
      });
  }, [roomId]);

  return (
    <div className={isLoaded ? s.container_load : s.container}>
      <ImageGallery images={images} />
      <div className={s.wrapper}>
        <Header title={nameRoom} />
        <Content sections={sections} />
        <Footer totalAmount={formatTotalAmount} />
      </div>
      {isLoaded && (
        <div className={s.loader}>
          <Loader />
        </div>
      )}
    </div>
  );
};
