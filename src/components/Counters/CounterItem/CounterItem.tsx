import { useAppSelector } from "../../../hooks/redux";
import { Application } from "../../../models/Application";
import {
  getActiveStep,
  getAssetFromCard,
  getCardByKeyPermission,
  getPropertyCounterCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import { Counter } from "../Counter/Counter";
import s from "./CounterItem.module.scss";

declare const app: Application;

interface PropsI {
  keyItemPermission: string;
  disabled?: boolean;
  dataAnalytics?: string;
}
export const CounterItem: React.FC<PropsI> = (props) => {
  const { disabled, keyItemPermission, dataAnalytics } = props;
  const activeStep = useAppSelector(getActiveStep);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  const cardAsset = useAppSelector(getAssetFromCard(card));
  const count = useAppSelector(
    getPropertyCounterCardByKeyPermission(activeStep, keyItemPermission)
  );

  if (!card || !card.counter || count === undefined) return null;

  const { min, max, threekit } = card.counter;

  const handleChange = (value: number) => {
    const attributeName = card.dataThreekit.attributeName;
    const isIncrement = value > count;
    if (isIncrement && value === min + 1) {
      app.addItemConfiguration(attributeName, cardAsset.id, card.keyPermission);
      return;
    }
    if (!isIncrement && disabled) {
      app.removeItem(attributeName, card.keyPermission);
      return;
    }
    if (isIncrement && value > 1 && disabled) {
      return;
    }
    app.changeCountItemConfiguration(
      threekit.key,
      value.toString(),
      card.keyPermission
    );
  };

  return (
    <div className={s.container}>
      <Counter
        min={min}
        max={max}
        onChange={handleChange}
        value={count}
        dataAnalytics={dataAnalytics}
      />
      <div className={s.text}>Max ({max})</div>
    </div>
  );
};
