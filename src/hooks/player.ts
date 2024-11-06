import { useEffect, useState } from "react";
import { getSelectedRoomSizeCard } from "../store/slices/ui/selectors/selectors";
import { useAppSelector } from "./redux";
import {
  getDistanceDataByKeyPermission,
  getPolarAngle,
  getTargetDataByKeyPermission,
} from "../utils/playerUtils";
import { Vector3 } from "three";
import { getDimensionEnabled } from "../store/slices/configurator/selectors/selectors";

export const usePlayer = () => {
  const [distance, setDistance] = useState<{
    minDistance?: number;
    maxDistance?: number;
  }>({
    minDistance: 35,
    maxDistance: 60,
  });

  const [target, setTarget] = useState<Vector3 | undefined>(
    new Vector3(-3.3342790694469784, 9.269443817758102, -3.999528610518013)
  );

  const [polarAngle, setPolarAngle] = useState<{
    minPolarAngle?: number;
    maxPolarAngle?: number;
  }>({
    minPolarAngle: Math.PI / 6,
    maxPolarAngle: Math.PI / 2,
  });

  const cardRoomSize = useAppSelector(getSelectedRoomSizeCard);
  const dimensionEnable = useAppSelector(getDimensionEnabled);

  useEffect(() => {
    if (!cardRoomSize) return;

    const distanceData = getDistanceDataByKeyPermission(
      cardRoomSize.keyPermission,
      dimensionEnable
    );
    const targetData = getTargetDataByKeyPermission(cardRoomSize.keyPermission);
    const polarAngleData = getPolarAngle(dimensionEnable);

    setDistance(distanceData);
    setTarget(targetData);
    setPolarAngle(polarAngleData);
  }, [cardRoomSize, dimensionEnable]);

  return {
    target,
    distance,
    polarAngle,
  };
};
