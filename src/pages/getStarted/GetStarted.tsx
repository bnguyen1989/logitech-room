import React from "react";
import s from "./GetStarted.module.scss";
import BannerImage from "../../assets/images/getStarted/banner.png";
import { Button } from "../../components/Buttons/Button/Button";
import { useDispatch } from 'react-redux'
import { moveToStartStep } from '../../store/slices/ui/Ui.slice'

export const GetStarted: React.FC = () => {
	const dispatch = useDispatch();
	const handleClick = () => {
		dispatch(moveToStartStep());
	};
  return (
    <div className={s.container}>
      <div className={s.image}>
        <img src={BannerImage} alt={"banner"} />
      </div>

      <div className={s.content}>
        <div className={s.header_title}>TAKE THE GUESSWORK OUT OF YOUR VIDEO CONFERENCING SETUP</div>
        <div className={s.title}>
          Configure the perfect video collaboration setup for any meeting room
        </div>

        <div className={s.description}>
          <div className={s.block_1}>
            Not sure where to start? Use our Room Configurator to instantly
            outfit any size meeting room with the perfect video conferencing
            solution. You’ll walk away with a fully customized solution guide
            based on your unique needs.
          </div>
          <div className={s.divider}></div>
          <div className={s.block_2}>
            <div className={s.block_2_title}>How it works:</div>

            <ul className={s.block_2_list}>
              <li>Answer a few quick questions about your space.</li>
              <li>Choose guided selections based on your room</li>
              <li>Get a complete look at the room you configured</li>
              <li>View and share your solution guide</li>
            </ul>
          </div>
        </div>

        <div className={s.actions}>
          <Button text="Get Started" variant="contained" onClick={handleClick} />
        </div>
      </div>
    </div>
  );
};
