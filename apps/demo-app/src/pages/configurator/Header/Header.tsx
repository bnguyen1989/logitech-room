import { NavigationMenu } from '../../../components/NavigationMenu/NavigationMenu.tsx';
import { useAppSelector } from '../../../hooks/redux.ts';
import { getActiveStep } from '../../../store/slices/ui/selectors/selectors.ts';
import s from './Header.module.scss';

export const Header: React.FC = () => {
  const activeStep = useAppSelector(getActiveStep);

  return (
    <div className={s.container}>
      <div className={s.navigationMenu}>
        <NavigationMenu />
      </div>
      <div className={s.title}>
        <div className={s.title_text}>{activeStep.title}</div>
        <div className={s.sub_title_text}>{activeStep.subtitle}</div>
      </div>
    </div>
  );
};
