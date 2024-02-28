import { useDispatch } from "react-redux";
import { CloseSVG } from "../../../assets";
import { useAppSelector } from "../../../hooks/redux";
import { setMySetupModal } from "../../../store/slices/modals/Modals.slice";
import { getSetupModalData } from "../../../store/slices/modals/selectors/selectors";
import { Button } from "../../Buttons/Button/Button";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { CheckBox } from "../../CheckBox/CheckBox";
import { Field } from "../../Fields/Field/Field";
import { Select } from "../../Fields/Select/Select";
import { ModalContainer } from "../ModalContainer/ModalContainer";
import s from "./SetupModal.module.scss";
import { useNavigate } from "react-router-dom";
import { ThreekitService } from "../../../services/Threekit/ThreekitService";
import { ConfigData } from "../../../utils/threekitUtils";
import { Application } from "../../../models/Application";
import { getSelectedConfiguratorCards } from "../../../store/slices/ui/selectors/selectors";
import { ItemCardI } from "../../../store/slices/ui/type";
import { useState } from "react";

declare const app: Application;

export const SetupModal: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen } = useAppSelector(getSetupModalData);
  const selectedCards: Array<ItemCardI> = useAppSelector(
    getSelectedConfiguratorCards
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    dispatch(setMySetupModal({ isOpen: false }));
  };

  const createOrder = async () => {
    const cardData = selectedCards.map((card) => {
      return {
        metadata: {
          data: JSON.stringify(card),
        },
        configurationId: card.threekit?.assetId || "",
        count: 1,
      };
    });
    return new ThreekitService().createOrder({
      customerId: ConfigData.userId,
      originOrgId: ConfigData.userId,
      platform: {
        id: "1",
        platform: "1",
        storeName: "1",
      },
      cart: cardData,
      metadata: {
        assetId: app.currentConfigurator.assetId,
        configuration: JSON.stringify(
          app.currentConfigurator.getConfiguration()
        ),
        description:
          "A complete room solution is more than the sum of its parts. Including these components will help ensure the overall meeting experience is excellent for participants both in the room and remote.",
        name: "Logitech Room Solution",
      },
    });
  };

  const handleSeeResults = () => {
    setIsSubmitting(true);
    createOrder()
      .then(() => {
        dispatch(setMySetupModal({ isOpen: false }));
        navigate("/room", { replace: true });
      })
      .finally(() => {
        setIsSubmitting(false);
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
          <div className={s.text}>
            <div className={s.title}>Show me the complete setup</div>
            <div className={s.subtitle}>
              All finished! Complete the form below so we can share a detailed
              look at your new space and a detailed shopping guide that you can
              download and share.
            </div>
          </div>
        </div>

        <div className={s.form}>
          <Field placeholder={"First Name"} required />
          <Field placeholder={"Last Name"} required />
          <Field placeholder={"Email Address"} required />
          <Field placeholder={"Phone Number"} required />
          <Field placeholder={"Company Name"} required />
          <Select
            onSelect={() => {}}
            options={[
              { label: "Option 1", value: "1" },
              { label: "Option 2", value: "2" },
              { label: "Option 3", value: "3" },
            ]}
            placeholder={"Job Function (L)"}
            required
          />
          <Select
            onSelect={() => {}}
            options={[
              { label: "Option 1", value: "1" },
              { label: "Option 2", value: "2" },
              { label: "Option 3", value: "3" },
            ]}
            placeholder={"Industry"}
            required
          />
          <Select
            onSelect={() => {}}
            options={[
              { label: "Option 1", value: "1" },
              { label: "Option 2", value: "2" },
              { label: "Option 3", value: "3" },
            ]}
            placeholder={"Country"}
          />
          <Select
            onSelect={() => {}}
            options={[
              { label: "Option 1", value: "1" },
              { label: "Option 2", value: "2" },
              { label: "Option 3", value: "3" },
            ]}
            placeholder={"Time Frame to Purchase:"}
          />
          <Select
            onSelect={() => {}}
            options={[
              { label: "Option 1", value: "1" },
              { label: "Option 2", value: "2" },
              { label: "Option 3", value: "3" },
            ]}
            placeholder={"Are you a Logitech Partner or Reseller?"}
          />
        </div>
        <div className={s.additional_info}>
          <div className={s.support_link}>
            <div>Need Product Support? Please</div>
            <a href="https://support.logi.com/hc/" target="_blank">
              Click Here.
            </a>
          </div>
          <CheckBox
            value={false}
            onChange={() => {}}
            text={
              "Would you like to be contacted by Logitech about this project?"
            }
          />
          <CheckBox
            value={false}
            onChange={() => {}}
            text={
              "By supplying my contact information, I authorize Logitech to contact me with personalized communications about Logitech's products and services, which per <a href='https://www.logitech.com/en-us/legal/web-privacy-policy.html' style='color: var(--main-color-text);'>Logitech's Privacy Policy</a> I may opt-out of at any time."
            }
          />
        </div>
        <div className={s.actions}>
          <Button
            text={"See my results"}
            onClick={handleSeeResults}
            variant={"contained"}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </ModalContainer>
  );
};
