import { useEffect } from "react";
import s from "./Configurator.module.scss";
import { Content } from "./Content/Content";
import { Header } from "./Header/Header";
import { useDispatch } from "react-redux";
import { moveToStartStep } from "../../store/slices/ui/Ui.slice";

export const Configurator: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(moveToStartStep());
  }, []);

  return (
    <div className={s.container}>
      <Header />

      <div className={s.content}>
        <Content />
      </div>
    </div>
  );
};
