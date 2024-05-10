import { useEffect, useState } from "react";
import { getSelectedRoomSizeCard } from "../store/slices/ui/selectors/selectors";
import { useAppSelector } from "./redux";
import { getDistanceDataByKeyPermission } from "../utils/playerUtils";

export const usePlayer = () => {
  const [distance, setDistance] = useState<{
    minDistance: number;
    maxDistance: number;
  }>({ minDistance: 35, maxDistance: 60 });
  const cardRoomSize = useAppSelector(getSelectedRoomSizeCard);

  useEffect(() => {
    if (!cardRoomSize) return;

    const distanceData = getDistanceDataByKeyPermission(
      cardRoomSize.keyPermission
    );
    setDistance(distanceData);
  }, [cardRoomSize]);

  return {
    distance,
  };
};
