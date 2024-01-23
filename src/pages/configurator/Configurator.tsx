import { Modals } from '../../components/Modals/Modals'
import s from "./Configurator.module.scss";
import { Content } from "./Content/Content";
import { Header } from "./Header/Header";

export const Configurator: React.FC = () => {
  return (
    <div className={s.container}>
      <Header />

      <div className={s.content}>
        <Content />
      </div>

      <Modals />
    </div>
  );
};
