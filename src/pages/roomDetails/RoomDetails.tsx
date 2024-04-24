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
import ImgBanner from "../../assets/images/pages/details/room_detail_banner.png";

export const RoomDetails: React.FC = () => {
  const { roomId } = useParams();
  const [sections, setSections] = useState<Array<SectionI>>([]);
  const [nameRoom, setNameRoom] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(true);

  const getTitleSectionOrderByStepName = (stepName: StepName) => {
    switch (stepName) {
      case StepName.ConferenceCamera:
        return "Conferencing Cameras";
      case StepName.AudioExtensions:
        return "Audio Add-Ons";
      case StepName.MeetingController:
        return "Audio Accessories";
      case StepName.VideoAccessories:
        return "Video Conferencing Add-Ons";
      case StepName.SoftwareServices:
        return "Services";
      default:
        return "";
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
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

          const sectionId = dataSections.findIndex(
            (section) =>
              section.title === getTitleSectionOrderByStepName(card.key)
          );

          let itemSection: SectionI = {
            title: getTitleSectionOrderByStepName(card.key),
            data: [
              {
                title: title,
                subtitle: card.description || description || "",
                image: card.image,
                selectValue: selectValue,
              },
            ],
          };

          if (card.key !== StepName.SoftwareServices) {
            const amountInt = parseFloat(price) * parseInt(count);
            total += amountInt;
            const amount = formatPrice(amountInt);
            itemSection = {
              ...itemSection,
              data: [
                {
                  ...itemSection.data[0],
                  partNumber: `${color} : ${sku}`,
                  count: parseInt(count),
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
