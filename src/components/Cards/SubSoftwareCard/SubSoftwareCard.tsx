import { useAppSelector } from "../../../hooks/redux";
import { getCardLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";
import { CardPageI } from "../../../types/textTypePage";
import { SelectItem } from "../../Fields/SelectItem/SelectItem";
import s from "./SubSoftwareCard.module.scss";

const getFormatName = (langCard: CardPageI) => (name: string) => {
  const arr = name.split(" ");
  const number = parseInt(arr[0]);
  if (isNaN(number)) {
    return name;
  }

  const arrLang = langCard.Text.Years.split(",");
  const nameFormat = arrLang[number - 1]?.trim();
  if (!nameFormat) return name;
  return nameFormat;
};

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
