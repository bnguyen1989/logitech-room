import { CardI } from "../../store/slices/ui/type";
import { ThreekitService } from "../Threekit/ThreekitService";
import { OrdersI } from "../Threekit/type";
import { RoomApi } from "../api/Server/RoomApi/RoomApi";

export class RoomService {
  private roomApi: RoomApi = new RoomApi();

  public async generateRoomCSV(shortId: string) {
    const orders = await new ThreekitService().getOrders({
      shortId,
    });
    console.log(orders);
    const header = this.getHeaderCSV();
    const formattedData = this.formatOrdersToDataCSV(orders);
    console.log(formattedData);

    const response = await this.roomApi.createCSV({
      header,
      data: formattedData[0],
    });
    return response.data;
  }

  private getHeaderCSV() {
    return [
      { id: "product_name", title: "Product name" },
      { id: "category", title: "Product category" },
      { id: "description", title: "Product description" },
      { id: "color", title: "Product color" },
      { id: "part_number", title: "Regionally appropriate part number" },
      { id: "mspr", title: "Regionally appropriate MSRP" },
      { id: "total_quantity", title: "Total quantity" },
      { id: "total_estimated_cost", title: "Total estimated cost" },
    ];
  }

  private formatOrdersToDataCSV(orders: OrdersI) {
    const dataOrders = orders.orders.map((order) => {
      const cart = order.cart;
      return cart.map((item: any) => {
        return item.metadata;
      });
    });

    return dataOrders.map((dataOrder) => {
      return dataOrder.map((dataCard) => {
        const { data, color, price, count, title, description, sku } = dataCard;
        const card = JSON.parse(data) as CardI;
        const amount = `$ ${parseFloat(price) * parseInt(count)}`;

        return {
          product_name: title,
          category: card.key,
          description: description,
          color: color,
          part_number: sku,
          mspr: price,
          total_quantity: count,
          total_estimated_cost: amount,
        };
      });
    });
  }
}
