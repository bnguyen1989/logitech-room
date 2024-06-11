import { useEffect, useState } from "react";
import { getSelectedRoomSizeCard } from "../store/slices/ui/selectors/selectors";
import { useAppSelector } from "./redux";
import {
  getDistanceDataByKeyPermission,
  getTargetDataByKeyPermission,
} from "../utils/playerUtils";
import { Vector3 } from "three";

export const usePlayer = () => {
  const [distance, setDistance] = useState<{
    minDistance: number;
    maxDistance: number;
  }>({ minDistance: 35, maxDistance: 60 });

  const [target, setTarget] = useState(
    new Vector3(-3.3342790694469784, 9.269443817758102, -3.999528610518013)
  );
  const cardRoomSize = useAppSelector(getSelectedRoomSizeCard);

  useEffect(() => {
    if (!cardRoomSize) return;

    const distanceData = getDistanceDataByKeyPermission(
      cardRoomSize.keyPermission
    );
    const targetData = getTargetDataByKeyPermission(cardRoomSize.keyPermission);

    setDistance(distanceData);
    setTarget(targetData);
  }, [cardRoomSize]);

  return {
    target,
    distance,
  };
};
