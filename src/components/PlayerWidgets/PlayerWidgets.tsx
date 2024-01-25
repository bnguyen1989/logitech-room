import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/redux";
import { getShowDimensions } from "../../store/slices/configurator/selectors/selectors";
import { Switcher } from "../Switcher/Switcher";
import s from "./PlayerWidgets.module.scss";
import { changeShowDimensions } from "../../store/slices/configurator/Configurator.slice";

export const PlayerWidgets: React.FC = () => {
  const dispatch = useDispatch();
  const showDimension = useAppSelector(getShowDimensions);

  const handleShowDimension = (value: boolean) => {
    dispatch(changeShowDimensions(value));
  };

  return (
    <div className={s.container}>
      <Switcher
        value={showDimension}
        onChange={handleShowDimension}
        label={"Dimension"}
      />
    </div>
  );
};
