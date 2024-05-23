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
import { getImageUrl } from "../../utils/browserUtils";
import { isBundleElement } from "../../utils/permissionUtils";
import { useAppSelector } from "../../hooks/redux";
import { getDetailRoomLangPage } from "../../store/slices/ui/selectors/selectoteLangPage";

export const RoomDetails: React.FC = () => {
  const { roomId } = useParams();
  const [sections, setSections] = useState<Array<SectionI>>([]);
  const [nameRoom, setNameRoom] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(true);
  const langPage = useAppSelector(getDetailRoomLangPage);

  const getTitleSectionOrderByStepName = (stepName: StepName) => {
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

  const titleSectionBundle = "Room Solution Bundle";

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
        const locale = room.metadata["locale"] as any;

        const formatPrice = getFormatPrice(
          locale.currencyLocale,
          locale.currency
        );
        let total = 0;
        const dataSections: Array<SectionI> = [];
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
            titleSection = titleSectionBundle;
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
              },
            ],
          };

          if (card.key !== StepName.SoftwareServices) {
            const amountInt = parseFloat(price) * parseInt(count);
            total += amountInt;
            const amount = formatPrice(amountInt);
            const partNumber = `${color}${color ? " : " : ""}${
              isBundleCard ? sku + "*" : sku
            }`;
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

        setSections(dataSections);
        setTotalAmount(formatPrice(total));
      })
      .finally(() => {
        setIsLoaded(false);
      });
  }, [roomId]);

  const ImgBanner = getImageUrl("images/pages/details/room_detail_banner.png");
  const images: string[] = [ImgBanner, ImgBanner, ImgBanner];

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
