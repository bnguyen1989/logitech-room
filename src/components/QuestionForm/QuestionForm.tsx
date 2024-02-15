import { RadioButton } from "../RadioButton/RadioButton";
import s from "./QuestionForm.module.scss";

interface PropsI {}
export const QuestionForm: React.FC<PropsI> = () => {
  return (
    <div className={s.container}>
      <div className={s.list}>
        <div className={`${s.item}`}>
          <div className={s.header_item}>
            <div className={s.title}>Label</div>
            <div className={s.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do?
            </div>
          </div>
          <div className={s.actions}>
            <RadioButton
              onChange={() => {}}
              value={false}
              text={"Option one"}
            />
            <RadioButton onChange={() => {}} value={true} text={"Option one"} />
            <RadioButton
              onChange={() => {}}
              value={false}
              text={"Option one"}
            />
            <RadioButton
              onChange={() => {}}
              value={false}
              text={"Option one"}
            />
          </div>
        </div>
        <div className={`${s.item} ${s.item_active}`}>
          <div className={s.header_item}>
            <div className={s.title}>Label</div>
            <div className={s.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do?
            </div>
          </div>
          <div className={`${s.actions} ${s.actions_active}`}>
            <RadioButton
              onChange={() => {}}
              value={false}
              text={"Option one"}
            />
            <RadioButton onChange={() => {}} value={true} text={"Option one"} />
            <RadioButton
              onChange={() => {}}
              value={false}
              text={"Option one"}
            />
            <RadioButton
              onChange={() => {}}
              value={false}
              text={"Option one"}
            />
          </div>
        </div>
        <div className={`${s.item}`}>
          <div className={s.header_item}>
            <div className={s.title}>Label</div>
            <div className={s.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do?
            </div>
          </div>
          <div className={s.actions}>
            <RadioButton
              onChange={() => {}}
              value={false}
              text={"Option one"}
            />
            <RadioButton onChange={() => {}} value={true} text={"Option one"} />
            <RadioButton
              onChange={() => {}}
              value={false}
              text={"Option one"}
            />
            <RadioButton
              onChange={() => {}}
              value={false}
              text={"Option one"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
