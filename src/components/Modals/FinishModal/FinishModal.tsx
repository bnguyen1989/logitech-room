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
import { useNavigate } from "react-router-dom";
import { getOrderData } from "../../../store/slices/ui/selectors/selectorsOrder";
import { ThreekitService } from "../../../services/Threekit/ThreekitService";
import { useEffect, useState } from "react";
import { Application } from "../../../models/Application";
import {
  EventActionName,
  EventCategoryName,
} from "../../../models/analytics/type";
import { getTKAnalytics } from "../../../utils/getTKAnalytics";

declare const app: Application;

export const FinishModal: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useUser();
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


    getTKAnalytics().stage({ stageName: EventActionName.configurator_complete });

    app.analyticsEvent({
      category: EventCategoryName.threekit_configurator,
      action: EventActionName.configurator_complete,
      value: {},
    });
    if (isShowSetupModal) {
      dispatch(setMySetupModal({ isOpen: true }));
      dispatch(setFinishModal({ isOpen: false }));
      return;
    }

    setSendRequest(true);
    const threekitService = new ThreekitService();
    const assetId = orderData.metadata.configurator.assetId;
    const snapshot = window.snapshot("blob") as Blob;
    threekitService
      .saveConfigurator(snapshot, assetId ?? "")
      .then((id) => {
        const linkSnapshot = threekitService.getSnapshotLinkById(id);
        orderData.metadata["snapshot"] = linkSnapshot;

        return threekitService.createOrder(orderData).then(() => {
          dispatch(setFinishModal({ isOpen: false }));
          navigate("/room", { replace: true });
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
