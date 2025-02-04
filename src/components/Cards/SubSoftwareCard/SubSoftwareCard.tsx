import { useAppSelector } from "../../../hooks/redux";
import { getSelectDataSoftwareCardLangByKeyPermission } from "../../../store/slices/ui/selectors/selectoteLangPage";
import { getFormatName } from "../../../utils/productUtils";
import { SelectItem } from "../../Fields/SelectItem/SelectItem";
import s from "./SubSoftwareCard.module.scss";

interface PropsI {
  keyItemPermission: string;
}
export const SubSoftwareCard: React.FC<PropsI> = (props) => {
  const { keyItemPermission } = props;

  const selectData = useAppSelector(
    getSelectDataSoftwareCardLangByKeyPermission(keyItemPermission)
  );
  

  return (
    <div className={s.sub_software_card}>
      <div className={s.actions}>
        <SelectItem
          keyItemPermission={keyItemPermission}
          defaultLabel={selectData.defaultLabel}
          dataAnalytics="card-choose-lorem-plan"
          getFormatName={getFormatName(selectData.valuesTemplate)}
        />
      </div>
    </div>
  );
};
