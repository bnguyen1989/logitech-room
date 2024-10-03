import React from "react";

import s from "../Card.module.scss";
import { useAppSelector } from "../../../../../../hooks/redux";
import { getDetailRoomLangPage } from "../../../../../../store/slices/ui/selectors/selectoteLangPage";

export const CardPartNumber: React.FC<{
  partNumber?: string;
  isHide: boolean;
  isBundle: boolean;
}> = ({ partNumber, isHide, isBundle }) => {
  const langPage = useAppSelector(getDetailRoomLangPage);

  return (
    <>
      {!!partNumber && !isHide && (
        <div className={s.part_number}>
          <div className={s.part_number_text}>{`${langPage.Card.PartNumber}${
            isBundle ? "*" : ""
          }`}</div>
          <div className={s.part_number_value}>{partNumber}</div>
        </div>
      )}
      {isHide && <div className={s.part_number}></div>}
    </>
  );
};
