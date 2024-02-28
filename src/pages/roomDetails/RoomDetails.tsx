import React, { useEffect, useState } from "react";
import s from "./RoomDetails.module.scss";
import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";
import { Content } from "./Content/Content";
import { useParams } from "react-router-dom";
import ImageItem from "../../assets/images/pages/details/item.png";
import { ThreekitService } from "../../services/Threekit/ThreekitService";
import { ItemCardI } from "../../store/slices/ui/type";
import { SectionI } from "./type";
import { StepName } from "../../models/permission/type";
import { Loader } from "../../components/Loader/Loader";

export const RoomDetails: React.FC = () => {
  const { roomId } = useParams();
  const [sections, setSections] = useState<Array<SectionI>>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    new ThreekitService()
      .getOrders({ shortId: roomId })
      .then((res) => {
        const [room] = res.orders;
        if (!room) return;
        const dataSections: Array<SectionI> = [];
        room.cart.forEach((item) => {
          const card = JSON.parse(item.metadata.data) as ItemCardI;

          const sectionId = dataSections.findIndex(
            (section) => section.title === card.key
          );

          let itemSection: SectionI = {
            title: card.key,
            data: [
              {
                title: card.title,
                subtitle: card.description || card.subtitle || "",
                image: ImageItem,
              },
            ],
          };

          if (card.key !== StepName.SoftwareServices) {
            itemSection = {
              ...itemSection,
              data: [
                {
                  ...itemSection.data[0],
                  partNumber: "Graphite : 960-000000",
                  count: card.counter?.currentValue || 1,
                  amount: `$ 0.000.00`,
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
      })
      .finally(() => {
        setIsLoaded(false);
      });
  }, [roomId]);

  return (
    <div className={s.container}>
      <div className={s.wrapper}>
        <Header />
        <Content sections={sections} />
        <Footer />
      </div>
      {isLoaded && (
        <div className={s.loader}>
          <Loader />
        </div>
      )}
    </div>
  );
};
