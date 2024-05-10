export enum ColumnNameCSVRoom {
	ROOM_NAME = "room_name",
	PRODUCT_NAME = "product_name",
	CATEGORY = "category",
	DESCRIPTION = "description",
	COLOR = "color",
	PART_NUMBER = "part_number",
	MSPR = "mspr",
	TOTAL_QUANTITY = "total_quantity",
	TOTAL_ESTIMATED_COST = "total_estimated_cost",
}

export type RowCSVRoomI = Record<ColumnNameCSVRoom, string>;
