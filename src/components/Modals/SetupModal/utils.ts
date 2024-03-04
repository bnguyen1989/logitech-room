import { RoomSizeName } from "../../../utils/permissionUtils";

export const getDescriptionRoomBySize = (size: string) => {
  switch (size) {
    case RoomSizeName.Phonebooth:
      return "Phone booths work great for ad-hoc video meetings when you need a quiet environment without disturbing others.";
    case RoomSizeName.Huddle:
      return "Huddle rooms are great for hybrid meetings with remote participants.";
    case RoomSizeName.Small:
      return "Small meeting rooms are great for hybrid meetings when you have a few more people in the room with you.";
    case RoomSizeName.Medium:
      return "These traditionally-sized rooms typically need additional add-ons or smarter capabilities to better capture the in-room action.";
    case RoomSizeName.Large:
      return "Large, traditionally shaped rooms typically require additional products to extend coverage and ensure everyone can be seen and heard clearly.";
    case RoomSizeName.Auditorium:
      return "Large, traditionally shaped rooms typically require additional products to extend coverage and ensure everyone can be seen and heard clearly.";
		default:
			return '';
  }
};
