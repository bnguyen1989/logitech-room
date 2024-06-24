import React from "react";
import s from "./LoaderPlayer.module.scss";
import { Loader } from "../../../../../components/Loader/Loader";
import { useAppSelector } from "../../../../../hooks/redux";
import { getIsProcessing } from "../../../../../store/slices/configurator/selectors/selectors";
import { getLoaderLangPage } from "../../../../../store/slices/ui/selectors/selectoteLangPage";

export const LoaderPlayer: React.FC = () => {
  const isProcessing = useAppSelector(getIsProcessing);
  const langPage = useAppSelector(getLoaderLangPage);

  if (!isProcessing) return null;
  return (
    <div className={s.container}>
      <Loader text={langPage.Player.title} />
    </div>
  );
};
