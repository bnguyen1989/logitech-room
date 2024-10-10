import { CardI } from "../../store/slices/ui/type";
import { LocaleT } from "../../types/locale";
import { StepName } from "../../utils/baseUtils";
import { langRegionCodes } from "../../utils/localeUtils";
import {
  SoftwareServicesName,
  isBundleElement,
  isCameraElement,
  isSoftwareService,
  isTapElement,
} from "../../utils/permissionUtils";
import { isShowPriceByLocale } from "../../utils/productUtils";
import { LanguageService } from "../LanguageService/LanguageService";
import { PriceService } from "../PriceService/PriceService";
import { SoftwarePriceService } from "../SoftwarePriceService/SoftwarePriceService";
import { ThreekitService } from "../Threekit/ThreekitService";
import { OrdersI } from "../Threekit/type";
import { RoomApi } from "../api/Server/RoomApi/RoomApi";
import { DataGetOrdersI } from "../api/Threekit/type";
import { ColumnNameCSVRoom, RowCSVRoomI } from "./type";

export class RoomService {
  private roomApi: RoomApi = new RoomApi();

  public async generateRoomCSV(
    params: DataGetOrdersI = {},
    locale: LocaleT = langRegionCodes.en_us
  ) {
    const orders = await new ThreekitService().getOrders({
      ...params,
    });
    const data = await this.generateCSVByOrders(orders, locale);
    return data;
  }

  private async generateCSVByOrders(orders: OrdersI, locale: LocaleT) {
    const formattedData = await this.formatOrdersToDataCSV(orders, locale);

    const langData = await new LanguageService().getLanguageData(locale);
    const langDataCSV = langData.pages.CSV;
    const dataLangHeader = langDataCSV.Header;
    const header = this.getHeaderCSV().map((item) => ({
      ...item,
      title: dataLangHeader[item.title],
    }));

    const response = await this.roomApi.createCSV({
      header,
      data: formattedData.flat(),
      disclaimer: langDataCSV.Annotation,
    });
    return response.data;
  }

  private getHeaderCSV() {
    return [
      { id: ColumnNameCSVRoom.ROOM_NAME, title: "RoomName" },
      { id: ColumnNameCSVRoom.CATEGORY, title: "ProductCategory" },
      { id: ColumnNameCSVRoom.PRODUCT_NAME, title: "ProductName" },
      {
        id: ColumnNameCSVRoom.PART_NUMBER,
        title: "PartNumber",
      },
      { id: ColumnNameCSVRoom.QUANTITY, title: "Quantity" },
      { id: ColumnNameCSVRoom.MSPR, title: "MSRP" },
      { id: ColumnNameCSVRoom.TOTAL_QUANTITY, title: "TotalMSRP" },
    ];
  }

  private async formatOrdersToDataCSV(
    orders: OrdersI,
    locale: LocaleT
  ): Promise<Array<Array<RowCSVRoomI>>> {
    const dataOrders = this.getDataOrdersForCSV(orders);

    const isShowPrice = isShowPriceByLocale(locale);

    return Promise.all(
      dataOrders.map(async (dataOrder) => {
        const { name, data } = dataOrder;
        const isContainBundle = data.some((item) =>
          isBundleElement(JSON.parse(item.data).keyPermission)
        );

        const softwareServiceName = data.reduce<string>((acc, item) => {
          const card = JSON.parse(item.data) as CardI;
          if (!isSoftwareService(card.keyPermission)) return acc;
          acc = card.keyPermission;
          return acc;
        }, "");

        const softwarePriceService = new SoftwarePriceService(
          softwareServiceName,
          locale
        );
        await softwarePriceService.loadData();

        const { cardsData, softwareCardExtendedWarranty } =
          this.processCardDataCSV(data);

        const rows: Array<RowCSVRoomI> = await cardsData.reduce(
          async (accPromise, dataCard, index) => {
            const acc = await accPromise;
            const { data, count, title, sku } = dataCard;
            const card = JSON.parse(data) as CardI;
            const isCamera = isCameraElement(card.keyPermission);
            const isTap = isTapElement(card.keyPermission);

            if (
              isContainBundle &&
              (isCamera || (isTap && parseInt(count) === 1)) &&
              card.key !== StepName.SoftwareServices
            ) {
              return acc;
            }

            const dataProduct = await new PriceService().getDataProductBySku(
              sku
            );
            const priceSoftware =
              softwarePriceService.getPriceForSoftwareServices(sku, title);
            const price = dataProduct.price ?? priceSoftware ?? 0.0;
            const amount = price * parseInt(count);

            let productName: string = title;
            if (
              softwareCardExtendedWarranty &&
              card.key === StepName.SoftwareServices
            ) {
              productName = `${softwareCardExtendedWarranty.title} ${softwareCardExtendedWarranty.selectValue} - ${title}`;
            }

            return [
              ...acc,
              {
                [ColumnNameCSVRoom.ROOM_NAME]: index === 0 ? name : "",
                [ColumnNameCSVRoom.CATEGORY]: card.key,
                [ColumnNameCSVRoom.PRODUCT_NAME]: productName,
                [ColumnNameCSVRoom.PART_NUMBER]: sku,
                [ColumnNameCSVRoom.QUANTITY]: count,
                [ColumnNameCSVRoom.MSPR]: isShowPrice ? price.toFixed(2) : "",
                [ColumnNameCSVRoom.TOTAL_QUANTITY]: isShowPrice
                  ? amount.toFixed(2)
                  : "",
              },
            ];
          },
          Promise.resolve([] as RowCSVRoomI[])
        );

        rows.push({
          ...Object.values(ColumnNameCSVRoom).reduce<RowCSVRoomI>(
            (acc, key) => {
              acc[key] = "";
              return acc;
            },
            {} as RowCSVRoomI
          ),
        });

        return rows;
      })
    );
  }

  private processCardDataCSV(data: any[]) {
    return data.reduce<{
      cardsData: any[];
      softwareCardExtendedWarranty: any | undefined;
    }>(
      (acc, item: any) => {
        const card = JSON.parse(item.data) as CardI;
        const isContainExtendedWarranty =
          card.keyPermission === SoftwareServicesName.ExtendedWarranty;

        if (isContainExtendedWarranty) {
          return {
            ...acc,
            softwareCardExtendedWarranty: item,
          };
        }

        return {
          ...acc,
          cardsData: [...acc.cardsData, item],
        };
      },
      { cardsData: [], softwareCardExtendedWarranty: undefined }
    );
  }

  private getDataOrdersForCSV(orders: OrdersI) {
    return orders.orders.map((order) => {
      const cardData = order.cart.map((item: any) => item.metadata);
      const nameRoom = order.metadata["name"];

      return {
        name: nameRoom,
        data: cardData,
      };
    });
  }
}
