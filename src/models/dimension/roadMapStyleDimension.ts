import { ColumnNameDimension } from "../../services/DimensionService/type";
import { RoomSizeName } from "../../utils/permissionUtils";
import { RoadMapStyleDimensionI } from "./type";

export const getRoadMapStyleDimensionByRoom = (): RoadMapStyleDimensionI => {
  return {
    [RoomSizeName.Phonebooth]: {},
    [RoomSizeName.Huddle]: {
      [ColumnNameDimension.TABLE_L_METER]: {
        desktop: {
          width: "10vw",
          height: "1vh",
        },
        mobile: {
          width: "24vw",
          height: "1vh",
        },
      },
    },
    [RoomSizeName.Small]: {
      [ColumnNameDimension.TABLE_L_METER]: {
        desktop: {
          width: "10vw",
          height: "1vh",
        },
        mobile: {
          width: "24vw",
          height: "1vh",
        },
      },
    },
    [RoomSizeName.Medium]: {
      [ColumnNameDimension.TABLE_L_METER]: {
        desktop: {
          width: "10vw",
          height: "1vh",
        },
        mobile: {
          width: "18vw",
          height: "1vh",
        },
      },
    },
    [RoomSizeName.Large]: {
      [ColumnNameDimension.TABLE_L_METER]: {
        desktop: {
          width: "10vw",
          height: "1vh",
        },
        mobile: {
          width: "18vw",
          height: "1vh",
        },
      },
    },
    [RoomSizeName.Auditorium]: {
      [ColumnNameDimension.TABLE_L_METER]: {
        desktop: {
          width: "10vw",
          height: "1vh",
        },
        mobile: {
          width: "25vw",
          height: "1vh",
        },
      },
    },
  };
};
