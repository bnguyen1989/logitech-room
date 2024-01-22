import { useAppSelector } from "../../hooks/redux";
import { getActiveStep } from "../../store/slices/ui/selectors/selectors";
import s from "./Configurator.module.scss";
import { Content } from "./Content/Content";
import { GetStarted } from "./GetStarted/GetStarted";
import { Header } from "./Header/Header";

export const Configurator: React.FC = () => {
  const activeStep = useAppSelector(getActiveStep);

  if (!activeStep) {
    return <GetStarted />;
  }

  return (
    <div className={s.container}>
      <Header />

      <div className={s.content}>
        <Content />
      </div>
    </div>
  );
};
