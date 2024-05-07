import s from "./RequestConsultation.module.scss";
import { getImageUrl } from '../../utils/browserUtils'

export const RequestConsultation = () => {
  return (
    <div className={s.container}>
      <div className={s.image}>
        <img src={getImageUrl("images/getStarted/banner.png")} alt={"banner"} />
      </div>

      <div className={s.content}>
        <div className={s.title}>Thank you for your request!</div>
        <div className={s.subtitle}>
          We will reach out shortly to discuss any remaining needs to finalize
          your quote and next steps.
        </div>
      </div>
    </div>
  );
};
