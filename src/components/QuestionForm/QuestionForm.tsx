import { EditSVG } from "../../assets";
import { QuestionFormI } from "../../store/slices/ui/type";
import { IconButton } from "../Buttons/IconButton/IconButton";
import { RadioButton } from "../RadioButton/RadioButton";
import s from "./QuestionForm.module.scss";
import React, { useState } from "react";

interface PropsI {
  baseData: Array<QuestionFormI>;
  submitData: (data: Array<QuestionFormI>) => void;
}
export const QuestionForm: React.FC<PropsI> = (props) => {
  const { baseData, submitData } = props;
  const [data, setData] = useState<Array<QuestionFormI>>(baseData);

  const handleClickEdit = (index: number) => {
    const currentData = data.map((item, i) => {
      if (i === index) {
        item.active = true;
        item.done = true;
      }
      return item;
    });
    setData(currentData);
  };

  const handleChangeValue = (indexData: number, indexOption: number) => {
    return (value: boolean) => {
      if (!value) return;
      const currentData = data.map((item, i) => {
        if (i === indexData) {
          item.options = item.options.map((option) => {
            option.value = false;
            return option;
          });
          item.options[indexOption].value = value;
        }
        return item;
      });
      const currentQuestionDone = currentData[indexData].done;
      if (currentQuestionDone) {
        currentData[indexData].active = false;
      }
      if (!currentQuestionDone) {
        currentData[indexData].done = true;
        currentData[indexData].active = false;
      }
      const isLastIndex = indexData == data.length - 1;
      if (!isLastIndex && !currentQuestionDone) {
        currentData[indexData + 1].active = true;
      }
      setData(currentData);
      if (isLastIndex) {
        submitData(currentData);
      }
    };
  };
  return (
    <div className={s.container}>
      <div className={s.list}>
        {data.map((question, index) => (
          <div
            key={index}
            className={`${s.wrapper} ${
              question.active ? s.wrapper_active : ""
            } ${question.done && !question.active ? s.wrapper_done : ""}`}
          >
            <div className={s.mark_item}>
              <div
                className={`${s.line} ${
                  (index !== 0 && !question.active) ||
                  (question.active && index !== data.length - 1)
                    ? s.line_visible
                    : ""
                }`}
              ></div>
              <div className={`${s.mark}`}>
                {question.done && !question.active ? <DoneSVG /> : null}
                {question.active ? <ActiveSVG /> : null}
                {!question.done && !question.active ? <DisableSVG /> : null}
              </div>

              <div
                className={`${s.line} ${
                  index !== data.length - 1 ? s.line_visible : ""
                }`}
              ></div>
            </div>
            <div className={`${s.item}`}>
              <div className={`${s.triangle}`}></div>
              <div className={s.header_item}>
                <div className={s.item_text}>
                  <div className={s.text}>{question.question}</div>
                </div>
                <div className={`${s.edit_button}`}>
                  <IconButton onClick={() => handleClickEdit(index)}>
                    <EditSVG />
                  </IconButton>
                </div>
              </div>
              <div className={`${s.actions}`}>
                {question.options.map((option, indexOption) => (
                  <RadioButton
                    key={indexOption}
                    onChange={handleChangeValue(index, indexOption)}
                    value={option.value}
                    text={option.text}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function DisableSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="39"
      viewBox="0 0 40 39"
      fill="none"
    >
      <circle cx="20.4277" cy="19.5" r="19.5" fill="#C3C6C8" />
      <path
        d="M27.2402 15.5658C27.2402 19.3909 22.9828 19.4498 22.9828 20.8633V21.2248C22.9828 21.6029 22.6669 21.9094 22.2773 21.9094H19.5938C19.2042 21.9094 18.8884 21.6029 18.8884 21.2248V20.7309C18.8884 18.6917 20.4815 17.8766 21.6854 17.2216C22.7178 16.6599 23.3505 16.2779 23.3505 15.5342C23.3505 14.5503 22.0573 13.8973 21.0117 13.8973C19.6485 13.8973 19.0192 14.5235 18.1345 15.607C17.896 15.899 17.4608 15.9533 17.1548 15.7281L15.5191 14.5246C15.2188 14.3037 15.1516 13.8933 15.3636 13.5911C16.7526 11.6119 18.5218 10.5 21.2762 10.5C24.161 10.5 27.2402 12.6851 27.2402 15.5658ZM23.4047 25.104C23.4047 26.4252 22.2971 27.5 20.9356 27.5C19.5741 27.5 18.4665 26.4252 18.4665 25.104C18.4665 23.7829 19.5741 22.7081 20.9356 22.7081C22.2971 22.7081 23.4047 23.7829 23.4047 25.104Z"
        fill="white"
      />
    </svg>
  );
}

function ActiveSVG() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32.5 64C49.897 64 64 49.897 64 32.5C64 15.103 49.897 1 32.5 1C15.103 1 1 15.103 1 32.5C1 49.897 15.103 64 32.5 64Z"
        fill="white"
      />
      <path
        d="M42.3555 27.3436C42.3555 33.6438 35.6145 33.7408 35.6145 36.069V36.6644C35.6145 37.2871 35.1144 37.7919 34.4975 37.7919H30.2487C29.6318 37.7919 29.1317 37.2871 29.1317 36.6644V35.8508C29.1317 32.4922 31.6542 31.1497 33.5604 30.0708C35.195 29.1458 36.1968 28.5166 36.1968 27.2916C36.1968 25.6711 34.1491 24.5956 32.4937 24.5956C30.3352 24.5956 29.3388 25.627 27.9381 27.4115C27.5605 27.8925 26.8714 27.9819 26.3868 27.611L23.797 25.6287C23.3216 25.2649 23.2151 24.5889 23.5509 24.0912C25.7501 20.8314 28.5512 19 32.9124 19C37.48 19 42.3555 22.599 42.3555 27.3436ZM36.2825 43.0537C36.2825 45.2297 34.5288 47 32.3731 47C30.2175 47 28.4637 45.2297 28.4637 43.0537C28.4637 40.8777 30.2175 39.1074 32.3731 39.1074C34.5288 39.1074 36.2825 40.8777 36.2825 43.0537Z"
        fill="#814EFA"
      />
    </svg>
  );
}

function DoneSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="39"
      viewBox="0 0 40 39"
      fill="none"
    >
      <circle cx="20.4277" cy="19.5" r="19.5" fill="#814EFA" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.478 24.5L13.2402 19.8839L14.8214 18.4901L18.478 21.7124L26.6591 14.5L28.2402 15.8948L18.478 24.5Z"
        fill="white"
      />
    </svg>
  );
}
