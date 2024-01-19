import { useAppSelector } from '../../hooks/redux.ts';
import { getActiveStep } from '../../store/slices/ui/selectors/selectors.ts';
import s from './Configurator.module.scss';
import { Content } from './Content/Content.tsx';
import { GetStarted } from './GetStarted/GetStarted.tsx';
import { Header } from './Header/Header.tsx';

export const Configurator: React.FC = () => {
  const activeStep = useAppSelector(getActiveStep);

  if (!activeStep) {
    return <GetStarted />;
  }

  return (
    <div className={s.container}>
      <Header />
      <Content />
    </div>
  );
};
