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
}
export const CounterItem: React.FC<PropsI> = (props) => {
  const { disabled, keyItemPermission } = props;
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
    if (value > count && value === 1) {
      const attributeName = card.dataThreekit.attributeName;
      app.addItemConfiguration(attributeName, cardAsset.id, card.keyPermission);
      return
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
        disabled={disabled}
      />
      <div className={s.text}>Max ({max})</div>
    </div>
  );
};
