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
          height: "0vh",
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
        },
      },
    },
  };
};
