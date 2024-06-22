import { CardI } from "../../store/slices/ui/type";
import { LocaleT } from "../../types/locale";
import { langRegionCodes } from "../../utils/localeUtils";
import { SoftwareServicesName } from "../../utils/permissionUtils";
import { getSKUProductByExtendedWarranty } from "../../utils/productUtils";
import { LanguageService } from "../LanguageService/LanguageService";
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
    const formattedData = this.formatOrdersToDataCSV(orders);

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
      { id: ColumnNameCSVRoom.CATEGORY, title: "ProductName" },
      { id: ColumnNameCSVRoom.PRODUCT_NAME, title: "ProductCategory" },
      {
        id: ColumnNameCSVRoom.PART_NUMBER,
        title: "PartNumber",
      },
      { id: ColumnNameCSVRoom.QUANTITY, title: "Quantity" },
      { id: ColumnNameCSVRoom.MSPR, title: "MSRP" },
      { id: ColumnNameCSVRoom.TOTAL_QUANTITY, title: "TotalMSRP" },
    ];
  }

  private formatOrdersToDataCSV(orders: OrdersI): Array<Array<RowCSVRoomI>> {
    const dataOrders = this.getDataOrdersForCSV(orders);

    return dataOrders.map((dataOrder) => {
      const { name, data } = dataOrder;
      const softwareCardData = data.find((item: any) => {
        const card = JSON.parse(item.data) as CardI;
        return card.keyPermission === SoftwareServicesName.ExtendedWarranty;
      });
      const rows: Array<RowCSVRoomI> = data.map((dataCard, index) => {
        const { data, price, count, title, sku, color } = dataCard;
        const card = JSON.parse(data) as CardI;
        const amount = parseFloat(price) * parseInt(count);

        let newSKU;
        if (softwareCardData) {
          const year = softwareCardData?.selectValue;
          const productName = color
            ? `${card.keyPermission} - ${color}`
            : card.keyPermission;
          newSKU = getSKUProductByExtendedWarranty(productName, year ?? "");
        }

        return {
          [ColumnNameCSVRoom.ROOM_NAME]: index === 0 ? name : "",
          [ColumnNameCSVRoom.CATEGORY]: card.key,
          [ColumnNameCSVRoom.PRODUCT_NAME]: title,
          [ColumnNameCSVRoom.PART_NUMBER]: newSKU ?? sku,
          [ColumnNameCSVRoom.QUANTITY]: count,
          [ColumnNameCSVRoom.MSPR]: parseFloat(price).toFixed(2),
          [ColumnNameCSVRoom.TOTAL_QUANTITY]: amount.toFixed(2),
        };
      });

      rows.push({
        ...Object.values(ColumnNameCSVRoom).reduce<RowCSVRoomI>((acc, key) => {
          acc[key] = "";
          return acc;
        }, {} as RowCSVRoomI),
      });

      return rows;
    });
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
