import { InformationSVG } from "../../../assets";
import { CardContainer } from "../CardContainer/CardContainer";
import s from "./CardItem.module.scss";
import MicImg from "../../../assets/images/items/mic.jpg";

interface PropsI {
  recommended?: boolean;
  children?: React.ReactNode;
}
export const CardItem: React.FC<PropsI> = (props) => {
  const { recommended, children } = props;

  return (
    <CardContainer
      onClick={() => {}}
      recommended={recommended}
      style={{ padding: "25px 20px" }}
			active
    >
      <div className={s.container}>
        <div className={s.left_content}>
          <div className={s.image}>
            <img src={MicImg} alt="item" />
          </div>
        </div>
        <div className={s.right_content}>
          <div className={s.header}>
            <div className={s.header_title}>Rally Mic Pod</div>
            <div className={s.title}>Modular Mics with RightSound</div>
          </div>
          <div className={s.content}>
            <div className={s.content_children}>{children}</div>
            <div className={s.info}>
              <InformationSVG />
            </div>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};
