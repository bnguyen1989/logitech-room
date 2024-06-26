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
import { isBundleElement } from "../../utils/permissionUtils";
import { useAppSelector } from "../../hooks/redux";
import {
  getCardLangPage,
  getDetailRoomLangPage,
} from "../../store/slices/ui/selectors/selectoteLangPage";
import { getFormatName } from "../../components/Cards/CardSoftware/CardSoftware";
import { getFormattingNameColor } from "../../components/ColorSwitchers/ColorSwitcherItem/ColorSwitcherItem";

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
    stepName: StepName | "Room Solution Bundle"
  ) => {
    switch (stepName) {
      case StepName.ConferenceCamera:
      case StepName.AudioExtensions:
      case StepName.MeetingController:
      case StepName.VideoAccessories:
      case StepName.SoftwareServices:
        return langPage.StepName[stepName];
      default:
        return "";
    }
  };

  const getFormatPrice =
    (locale: string, currency: string) => (price: number) => {
      const formattedCurrency = currency.toUpperCase();
      const localeParts = locale.split("-");

      if (localeParts.length !== 2) {
        return price.toString();
      }

      const formattedLocale = `${
        localeParts[0]
      }-${localeParts[1].toUpperCase()}`;

      return price.toLocaleString(formattedLocale, {
        style: "currency",
        currency: formattedCurrency,
      });
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

        const formatPrice = getFormatPrice(
          locale.currencyLocale,
          locale.currency
        );
        let total = 0;
        const dataSections: Array<SectionI> = [];

        const getLabelValue = (selectValue?: string) => {
          if (selectValue?.includes("Years")) {
            return getFormatName(langCard)(selectValue);
          }

          return selectValue;
        };
        room.cart.forEach((item) => {
          const {
            data,
            color,
            price,
            count,
            title,
            sku,
            description,
            selectValue,
          } = item.metadata;
          const card = JSON.parse(data) as CardI;

          let titleSection = getTitleSectionOrderByStepName(card.key);
          const isBundleCard = isBundleElement(card.keyPermission);
          if (isBundleCard) {
            titleSection = getTitleSectionOrderByStepName(
              "Room Solution Bundle"
            );
          }

          const sectionId = dataSections.findIndex(
            (section) => section.title === titleSection
          );

          let itemSection: SectionI = {
            title: titleSection,
            data: [
              {
                title: title,
                subtitle: description ?? "",
                image: card.image ?? "",
                selectValue: selectValue,
                labelValue: getLabelValue(selectValue),
              },
            ],
          };

          if (card.key !== StepName.SoftwareServices) {
            let priceNumber = parseFloat(price);
            if (isNaN(priceNumber)) {
              priceNumber = 0.0;
            }
            const amountNumber = priceNumber * parseInt(count);
            total += amountNumber;
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

        debugger;

        setSections(dataSections);
        setTotalAmount(formatPrice(total));
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
