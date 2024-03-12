import { ColorItemI } from "../../../store/slices/ui/type";
import {
  getActiveStep,
  getCardByKeyPermission,
  getPropertyColorCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import { useAppSelector } from "../../../hooks/redux";
import { Application } from "../../../models/Application";
import { ColorSwitcher } from "../ColorSwitcher/ColorSwitcher";

declare const app: Application;

interface PropsI {
  keyItemPermission: string;
}
export const ColorSwitcherItem: React.FC<PropsI> = (props) => {
  const { keyItemPermission } = props;
  const activeStep = useAppSelector(getActiveStep);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  const colorValue = useAppSelector(
    getPropertyColorCardByKeyPermission(activeStep, keyItemPermission)
  );

  if (!card || !card.color || !colorValue) return;

  const value = card.color.colors.find((color) => color.name === colorValue);

  if (!value) return;

  const handleChange = (value: ColorItemI) => {
    app.changeColorItemConfiguration(value.name, card.keyPermission);
  };

  return (
    <ColorSwitcher
      value={value}
      onChange={handleChange}
      listColors={card.color.colors}
    />
  );
};
