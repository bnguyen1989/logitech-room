import React, { useEffect } from "react";
import s from "./GetStarted.module.scss";
import BannerImage from "../../assets/images/getStarted/banner.png";
import { Button } from "../../components/Buttons/Button/Button";
import { useDispatch } from "react-redux";
import { changeActiveStep } from "../../store/slices/ui/Ui.slice";
import { useNavigate } from "react-router-dom";

export const GetStarted: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = () => {
    navigate("/configurator", { replace: true });
  };

  useEffect(() => {
    dispatch(changeActiveStep(null));
  }, []);

  return (
    <div className={s.container}>
      <div className={s.image}>
        <img src={BannerImage} alt={"banner"} />
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
              onClick={handleClick}
            />
            <Button
              text="I’m a partner"
              variant="outlined"
              onClick={handleClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
