import { useAppSelector } from "../../../hooks/redux";
import { getCardLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";
import { getFormatName } from "../../../utils/productUtils";
import { SelectItem } from "../../Fields/SelectItem/SelectItem";
import s from "./SubSoftwareCard.module.scss";

interface PropsI {
  keyItemPermission: string;
}
export const SubSoftwareCard: React.FC<PropsI> = (props) => {
  const { keyItemPermission } = props;

  const langCard = useAppSelector(getCardLangPage);

  return (
    <div className={s.sub_software_card}>
      <div className={s.actions}>
        <SelectItem
          keyItemPermission={keyItemPermission}
          defaultLabel={langCard.Text.ChooseNumberOfYears}
          dataAnalytics="card-choose-lorem-plan"
          getFormatName={getFormatName(langCard)}
        />
      </div>
    </div>
  );
};
