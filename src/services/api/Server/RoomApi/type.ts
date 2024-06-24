export interface DataCreateRoomCSV {
  header: Record<string, string>[];
  data: Record<string, any>[];
  disclaimer?: string;
}
