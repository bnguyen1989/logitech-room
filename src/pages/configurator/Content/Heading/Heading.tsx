import { useAppSelector } from "../../../../hooks/redux";
import { getActiveStepData } from "../../../../store/slices/ui/selectors/selectors";
import s from "./Heading.module.scss";

export const Heading: React.FC = () => {
  const activeStepData = useAppSelector(getActiveStepData);

  return (
    <div className={s.container}>
      <div className={s.title}>{activeStepData.title}</div>
      {activeStepData.subtitle && (
        <div
          className={s.subtitle}
          dangerouslySetInnerHTML={{ __html: activeStepData.subtitle }}
        ></div>
      )}
    </div>
  );
};
