import React from "react";
import s from "./Footer.module.scss";
import { Actions } from "../Actions/Actions";
import { getDetailRoomLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";
import { useAppSelector } from "../../../hooks/redux";

interface PropsI {
  totalAmount?: string;
}
export const Footer: React.FC<PropsI> = (props) => {
  const { totalAmount } = props;
  const langPage = useAppSelector(getDetailRoomLangPage);

  return (
    <div className={s.container}>
      <div className={s.desc}>
        <div className={s.text}>{langPage.subtitle.v2}</div>

        {!!totalAmount && (
          <div className={s.total_amount}>
            <div className={s.total}>{langPage.Footer.Total}</div>
            <div className={s.amount}>
              <div className={s.amount_value}>{totalAmount}</div>
              <div className={s.amount_text}>MSRP</div>
            </div>
          </div>
        )}
      </div>
      <div className={s.buttons}>
        <Actions />
      </div>
    </div>
  );
};
