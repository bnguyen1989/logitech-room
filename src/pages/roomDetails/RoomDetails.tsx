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
import { StepName } from "../../utils/baseUtils";
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
import { getFormattingNameColor } from "../../components/ColorSwitchers/ColorSwitcherItem/ColorSwitcherItem";
import { PriceService } from "../../services/PriceService/PriceService";

export const RoomDetails: React.FC = () => {
  const { roomId } = useParams();
  const [sections, setSections] = useState<Array<SectionI>>([]);
  const [nameRoom, setNameRoom] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<string>("");
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
      .then((res) => {
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
        let total = 0;
        const dataSections: Array<SectionI> = [];

        const getLabelValue = (selectValue?: string) => {
          if (selectValue?.includes("Years")) {
            return getFormatName(langCard)(selectValue);
          }

          return selectValue;
        };

        const isContainBundle = room.cart.some((item) =>
          isBundleElement(JSON.parse(item.metadata.data).keyPermission)
        );
        let isBundleTapIp = false;
        room.cart.forEach(async (item) => {
          const { data, color, count, title, sku, description, selectValue } =
            item.metadata;
          const card = JSON.parse(data) as CardI;

          const isBundleCard = isBundleElement(card.keyPermission);
          if (isBundleCard) return;
          let keySection: any = card.key;

          const isCamera = isCameraElement(card.keyPermission);
          const isTap = isTapElement(card.keyPermission);
          if (
            isContainBundle &&
            (isCamera || (isTap && parseInt(count) === 1 && !isBundleTapIp))
          ) {
            if (isTap) {
              isBundleTapIp = true;
            }
            keySection = "Room Solution Bundles";
          }

          const titleSection = getTitleSectionOrderByStepName(keySection);

          const sectionId = dataSections.findIndex(
            (section) => section.title === titleSection
          );

          const dataProduct = await new PriceService().getDataProductBySku(sku);
          const inStock = dataProduct.inStock ?? true;

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
              },
            ],
            typeSection: keySection,
          };

          if (card.key !== StepName.SoftwareServices) {
            const priceNumber = dataProduct.price ?? 0.0;
            const strikeThroughPrice = dataProduct.strikeThroughPrice;

            const amountNumber = priceNumber * parseInt(count);
            total += amountNumber;
            setTotalAmount(formatPrice(total));
            console.log("amountNumber", amountNumber)
            console.log("total", total);
            
            const amount = formatPrice(priceNumber);

            const partNumber = `${getFormattingNameColor(color)(langCard)}${
              color ? " : " : ""
            }${isBundleCard ? sku + "*" : sku}`;
            itemSection = {
              ...itemSection,
              data: [
                {
                  ...itemSection.data[0],
                  partNumber,
                  count: count,
                  amount,
                  strikeThroughPrice: strikeThroughPrice
                    ? formatPrice(strikeThroughPrice)
                    : undefined,
                },
              ],
            };
          }

          if (sectionId === -1) {
            dataSections.push(itemSection);
            return;
          }

          dataSections[sectionId].data.push(itemSection.data[0]);
        });

        setSections(dataSections);
        console.log("total-1", total);
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
        <Footer totalAmount={totalAmount} />
      </div>
      {isLoaded && (
        <div className={s.loader}>
          <Loader />
        </div>
      )}
    </div>
  );
};
