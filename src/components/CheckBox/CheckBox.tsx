import { useSession } from "@threekit/react-three-fiber";
import s from "./CheckBox.module.scss";
import { ConfigData } from "../../utils/threekitUtils";
import { optionsShow } from "../../utils/analytics/optionsShow";
import { useEffect } from "react";
import { optionInteraction } from "../../utils/analytics/optionSelect";

interface PropsI {
  value?: boolean;
  onChange?: (value: boolean) => void;
  text: string;
}
export const CheckBox: React.FC<PropsI> = (props) => {
  const { sessionId } = useSession();
  const auth =  {
    host: ConfigData.host,
    orgId: ConfigData.orgId,
    publicToken: ConfigData.publicToken,
  },
  
  const { value, onChange, text } = props;

  useEffect( () => {
    optionsShow({
      auth,
      options: [true, false].map((item) => ({
        optionId: String(item),
        optionName: String(item),
        optionValue: String(item)
      })),
      optionsSetKey: text,
      sessionId  
    });
  }, [ text ]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) {
      return;
    }
    optionInteraction({
      auth,
      optionId: e.target.checked.toString(),
      optionsSetKey: text,
      sessionId
    })
    onChange(e.target.checked);
  };
  return (
    <div className={s.container}>
      <input type="checkbox" checked={value} onChange={handleChange} />
      <div className={s.checkmark}></div>
      <label
        className={s.text}
        htmlFor="custom_checkbox"
        dangerouslySetInnerHTML={{ __html: text }}
      ></label>
    </div>
  );
};
