import { memo, useEffect, useRef } from "react";
import { setDataCamera } from "../../store/slices/configurator/Configurator.slice";
import { DataCamera } from "../../models/R3F";
import { useDispatch } from "react-redux";
import { getDataCamera } from "../../store/slices/configurator/selectors/selectors";
import { useAppSelector } from "../../hooks/redux";

const arePropsEqual = (prevProps: any, nextProps: any) => {
  // Повертає true, якщо пропси рівні (тобто компонент не потребує перерендеринга)
  return prevProps.roomAssetId === nextProps.roomAssetId;
};

export const CameraRoom = memo(({ roomAssetId, ...props }: any) => {
  const prevRoomAssetId = useRef(undefined);
  const dispatch = useDispatch();
  const dataCamera = useAppSelector(getDataCamera);
  console.log("dataCamera", dataCamera);

  //@ts-ignore
  window.cameraR3f = props.camera;

  useEffect(() => {
    const isFirstStartRoom =
      prevRoomAssetId.current === undefined && dataCamera.roomAssetId === "";
    const isSecondStartRoom =
      prevRoomAssetId.current === undefined && dataCamera.roomAssetId !== "";

    if (isFirstStartRoom) {
      //@ts-ignore
      prevRoomAssetId.current = dataCamera;

      const dataCameraObject: DataCamera = {
        position: props["camera"].position.toArray(),
        roomAssetId: roomAssetId,
      };

      dispatch(setDataCamera(dataCameraObject));
    }

    if (
      isSecondStartRoom &&
      dataCamera.roomAssetId !== roomAssetId &&
      roomAssetId !== undefined
    ) {
      //@ts-ignore
      prevRoomAssetId.current = dataCamera;

      const dataCameraObject: DataCamera = {
        position: props["camera"].position.toArray(),
        roomAssetId: roomAssetId,
      };

      dispatch(setDataCamera(dataCameraObject));
    }

    app.eventEmitter.on("resetCamera", (data: DataCamera) => {
      const camera = props.camera;

      camera.position.fromArray(data.position);
    });
  }, [roomAssetId, dataCamera]);

  return <></>;
}, arePropsEqual);
