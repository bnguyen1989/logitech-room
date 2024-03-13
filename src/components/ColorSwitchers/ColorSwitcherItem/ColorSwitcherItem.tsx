import { ColorItemI } from "../../../store/slices/ui/type";
import {
  getActiveStep,
  getCardByKeyPermission, 
} from "../../../store/slices/ui/selectors/selectors";
import { useAppSelector } from "../../../hooks/redux";
import { Application } from "../../../models/Application";
import { ColorSwitcher } from "../ColorSwitcher/ColorSwitcher";
import { getColorsFromCard, getPropertyColorCardByKeyPermission } from "../../../store/slices/ui/selectors/selectorsColorsCard";

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
  const availableColorsData = useAppSelector(getColorsFromCard(keyItemPermission))

  if (!card) return;
  if (availableColorsData.length < 1) return;


  const handleChange = (value: ColorItemI) => {
    app.changeColorItemConfiguration(value.name, card.keyPermission);
  };

  return (
    <ColorSwitcher value={colorValue} onChange={handleChange} listColors={availableColorsData} />
  );
};
