export enum ColumnNameCSVRoom {
	ROOM_NAME = "room_name",
	CATEGORY = "category",
	PRODUCT_NAME = "product_name",
	PART_NUMBER = "part_number",
	QUANTITY = "quantity",
	MSPR = "mspr",
	TOTAL_QUANTITY = "total_quantity",
}

export type RowCSVRoomI = Record<ColumnNameCSVRoom, string>;
