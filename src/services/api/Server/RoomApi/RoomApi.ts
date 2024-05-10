import { ServerApi } from "../ServerApi";
import { DataCreateRoomCSV } from './type'

export class RoomApi extends ServerApi {
  public async createCSV(data: DataCreateRoomCSV) {
    return this.axiosInstance.post(`room/generate-csv`, data, {
      responseType: "blob",
    });
  }
}
