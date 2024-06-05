import { useDispatch } from "react-redux";
import { ArrowLeftSVG, CheckMarkSVG, CloseSVG } from "../../../assets";
import { useAppSelector } from "../../../hooks/redux";
import { getFinishModalData } from "../../../store/slices/modals/selectors/selectors";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { ModalContainer } from "../ModalContainer/ModalContainer";
import s from "./FinishModal.module.scss";
import {
  setFinishModal,
  setMySetupModal,
} from "../../../store/slices/modals/Modals.slice";
import { Button } from "../../Buttons/Button/Button";
import { useUser } from "../../../hooks/user";
import { PermissionUser } from "../../../utils/userRoleUtils";
import { getOrderData } from "../../../store/slices/ui/selectors/selectorsOrder";
import { ThreekitService } from "../../../services/Threekit/ThreekitService";
import { useEffect, useState } from "react";
import { Application } from "../../../models/Application";
import {
  EventActionName,
  EventCategoryName,
} from "../../../models/analytics/type";
import { getTKAnalytics } from "../../../utils/getTKAnalytics";
import { useUrl } from "../../../hooks/url";

declare const app: Application;

export const FinishModal: React.FC = () => {
  const dispatch = useDispatch();
  const user = useUser();
  const { handleNavigate } = useUrl();
  const { isOpen } = useAppSelector(getFinishModalData);
  const orderData: any = useAppSelector(getOrderData(user.id));
  const [sendRequest, setSendRequest] = useState(false);

  const userCanShowSetupModal = user.role.can(PermissionUser.SHOW_SETUP_MODAL);
  const isShowSetupModal = userCanShowSetupModal && user.isEmptyUserData();

  useEffect(() => {
    getTKAnalytics().stage({ stageName: "Finish Modal" });
  }, []);

  const handleClose = () => {
    getTKAnalytics().custom({ customName: "Finish Modal Back" });
    dispatch(setFinishModal({ isOpen: false }));
  };

  const handleLetsProceed = () => {
    getTKAnalytics().stage({
      stageName: EventActionName.configurator_complete,
    });

    app.analyticsEvent({
      category: EventCategoryName.threekit_configurator,
      action: EventActionName.configurator_complete,
      value: {},
    });
    setSendRequest(true);
    const threekitService = new ThreekitService();
    const assetId = orderData.metadata.configurator.assetId;
    const snapshotFront = window.snapshot("blob", "Front") as Blob;
    const snapshotLeft = window.snapshot("blob", "Left") as Blob;
    Promise.all([
      threekitService.saveConfigurator(snapshotFront, assetId ?? ""),
      threekitService.saveConfigurator(snapshotLeft, assetId ?? ""),
    ])
      .then((res) => {
        const linkSnapshotFront = threekitService.getSnapshotLinkById(res[0]);
        const linkSnapshotLeft = threekitService.getSnapshotLinkById(res[1]);
        orderData.metadata["snapshots"] = JSON.stringify({
          Front: linkSnapshotFront,
          Left: linkSnapshotLeft,
        });
        return threekitService.createOrder(orderData).then(() => {
          dispatch(setFinishModal({ isOpen: false }));
          if (isShowSetupModal) {
            dispatch(
              setMySetupModal({
                isOpen: true,
                dataModal: { linkSnapshot: linkSnapshotFront },
              })
            );
          } else {
            handleNavigate("/room");
          }
        });
      })
      .finally(() => {
        setSendRequest(false);
      });
  };

  if (!isOpen) return null;

  return (
    <ModalContainer>
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.close}>
            <IconButton onClick={handleClose}>
              <CloseSVG />
            </IconButton>
          </div>
        </div>
        <div className={s.content}>
          <div className={s.icon}>
            <CheckMarkSVG />
          </div>
          <div className={s.title}>
            This is the final product step! Ready to lock in your selections?
          </div>
          <div className={s.actions}>
            <IconButton
              onClick={handleClose}
              variant={"outlined"}
              position={"left"}
              text={"Back"}
            >
              <ArrowLeftSVG />
            </IconButton>
            <Button
              onClick={handleLetsProceed}
              text={"Yes, Let's Proceed"}
              variant={"contained"}
              disabled={sendRequest}
            />
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
