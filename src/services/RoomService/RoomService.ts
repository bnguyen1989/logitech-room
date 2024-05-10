import { CardI } from "../../store/slices/ui/type";
import { getDisclaimerCSV } from "../../store/slices/ui/utils";
import { ThreekitService } from "../Threekit/ThreekitService";
import { OrdersI } from "../Threekit/type";
import { RoomApi } from "../api/Server/RoomApi/RoomApi";
import { DataGetOrdersI } from "../api/Threekit/type";
import { ColumnNameCSVRoom, RowCSVRoomI } from "./type";

export class RoomService {
  private roomApi: RoomApi = new RoomApi();

  public async generateRoomCSV(params: DataGetOrdersI = {}) {
    const orders = await new ThreekitService().getOrders({
      ...params,
    });
    const data = await this.generateCSVByOrders(orders);
    return data;
  }

  private async generateCSVByOrders(orders: OrdersI) {
    const header = this.getHeaderCSV();
    const formattedData = this.formatOrdersToDataCSV(orders);
    console.log(formattedData);

    const response = await this.roomApi.createCSV({
      header,
      data: formattedData.flat(),
      disclaimer: getDisclaimerCSV(),
    });
    return response.data;
  }

  private getHeaderCSV() {
    return [
      { id: ColumnNameCSVRoom.ROOM_NAME, title: "Room name" },
      { id: ColumnNameCSVRoom.PRODUCT_NAME, title: "Product name" },
      { id: ColumnNameCSVRoom.CATEGORY, title: "Product category" },
      { id: ColumnNameCSVRoom.DESCRIPTION, title: "Product description" },
      { id: ColumnNameCSVRoom.COLOR, title: "Product color" },
      {
        id: ColumnNameCSVRoom.PART_NUMBER,
        title: "Regionally appropriate part number",
      },
      { id: ColumnNameCSVRoom.MSPR, title: "Regionally appropriate MSRP" },
      { id: ColumnNameCSVRoom.TOTAL_QUANTITY, title: "Total quantity" },
      {
        id: ColumnNameCSVRoom.TOTAL_ESTIMATED_COST,
        title: "Total estimated cost",
      },
    ];
  }

  private formatOrdersToDataCSV(orders: OrdersI): Array<Array<RowCSVRoomI>> {
    const dataOrders = this.getDataOrdersForCSV(orders);

    return dataOrders.map((dataOrder) => {
      const { name, data } = dataOrder;
      const rows: Array<RowCSVRoomI> = data.map((dataCard, index) => {
        const { data, color, price, count, title, description, sku } = dataCard;
        const card = JSON.parse(data) as CardI;
        const amount = `$ ${parseFloat(price) * parseInt(count)}`;

        return {
          [ColumnNameCSVRoom.ROOM_NAME]: index === 0 ? name : "",
          [ColumnNameCSVRoom.PRODUCT_NAME]: title,
          [ColumnNameCSVRoom.CATEGORY]: card.key,
          [ColumnNameCSVRoom.DESCRIPTION]: description,
          [ColumnNameCSVRoom.COLOR]: color,
          [ColumnNameCSVRoom.PART_NUMBER]: sku,
          [ColumnNameCSVRoom.MSPR]: price,
          [ColumnNameCSVRoom.TOTAL_QUANTITY]: count,
          [ColumnNameCSVRoom.TOTAL_ESTIMATED_COST]: amount,
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
