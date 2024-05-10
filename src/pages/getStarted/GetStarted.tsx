import React from "react";
import s from "./GetStarted.module.scss";
import { Button } from "../../components/Buttons/Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeRoleUser } from "../../store/slices/user/User.slice";
import { RoleUserName, getRoleByName } from "../../utils/userRoleUtils";
import { getImageUrl } from "../../utils/browserUtils";

export const GetStarted: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCustomerClick = () => {
    dispatch(
      changeRoleUser({ role: getRoleByName(RoleUserName.CUSTOMER).getData() })
    );
    navigate("/configurator", { replace: true });
  };
  const handlePartnerClick = () => {
    dispatch(
      changeRoleUser({ role: getRoleByName(RoleUserName.PARTNER).getData() })
    );
    navigate("/configurator", { replace: true });
  };

  return (
    <div className={s.container}>
      <div className={s.image}>
        <img src={getImageUrl("images/getStarted/banner.png")} alt={"banner"} />
      </div>

      <div className={s.content}>
        <div className={s.header_title}>
          TAKE THE GUESSWORK OUT OF YOUR VIDEO CONFERENCING SETUP
        </div>
        <div className={s.title}>
          Configure the perfect video collaboration setup for any meeting room
        </div>

        <div className={s.description}>
          <div className={s.block_1}>
            Not sure where to start? Use our Room Configurator to instantly
            outfit any size meeting room with the perfect video conferencing
            solution.
          </div>
          <div className={s.divider}></div>
          <div className={s.block_2}>
            <div className={s.block_2_title}>How it works:</div>

            <ul className={s.block_2_list}>
              <li>Answer a few quick questions about your space</li>
              <li>Choose guided selections based on your room</li>
              <li>Get a complete look at the room(s) you configured</li>
              <li>View and share your detailed solutions per room</li>
            </ul>
          </div>
        </div>

        <div className={s.type_user}>
          <div className={s.type_user_title}>
            Ready to get started? Choose the best experience for you.
          </div>
          <div className={s.type_user_buttons}>
            <Button
              text="I’m a customer"
              variant="contained"
              onClick={handleCustomerClick}
            />
            <Button
              text="I’m a partner"
              variant="outlined"
              onClick={handlePartnerClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
