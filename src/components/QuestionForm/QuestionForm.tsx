import { EditSVG } from "../../assets";
import { IconButton } from "../Buttons/IconButton/IconButton";
import { RadioButton } from "../RadioButton/RadioButton";
import s from "./QuestionForm.module.scss";
import React from "react";

interface PropsI {}
export const QuestionForm: React.FC<PropsI> = () => {
  const listQuestion = [
    {
      title: "Label",
      question:
        " What are your hours of support?",
      options: [
        { value: false, text: "Business Hours" },
        { value: true, text: "24/7" },
      ],
      active: false,
      done: true,
    },
    {
      title: "Label",
      question:
        "What’s your repair time for meeting rooms?",
      options: [
        { value: false, text: "Within 1 week" },
        { value: false, text: "Within 1 hour" },
      ],
      active: true,
      done: false,
    },
    {
      title: "Label",
      question:
        "What’s the typical lifecycle for meeting room hardware?",
      options: [
        { value: false, text: "Less than 2 years" },
        { value: false, text: "2-4 years" },
        { value: false, text: "5 years or more" },
      ],
      active: false,
      done: false,
    },
    {
      title: "Label",
      question:
        "What support service is needed for you to ensure your meeting rooms are always up and running?",
      options: [
        { value: false, text: "Tech support when I need it" },
        { value: false, text: "Dedicated, additional service and support" },
        { value: false, text: "Option one" },
      ],
      active: false,
      done: false,
    },
  ];
  const [data, setData] = React.useState(listQuestion);
  const handleClickEdit = (index: number) => {
    const currentData = data.map((item, i) => {
      if (i < index) {
        return item;
      }
      if (i === index) {
        item.active = true;
        item.done = false;
      } else {
        item.active = false;
        item.done = false;
        item.options = item.options.map((option) => {
          option.value = false;
          return option;
        });
      }
      return item;
    });
    setData(currentData);
  };

  //temp create function for demo work this form
  const handleClick = (index: number) => {
    const currentData = data.map((item, i) => {
      if (i === index) {
        item.active = true;
        item.done = false;
      } else {
        item.active = false;
        item.done = false;
      }
      return item;
    });
    setData(currentData);
  };
  
  const handleChangeValue = (indexData: number, indexOption: number) => {
    return (value: boolean) => {
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
      setData(currentData);
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
            } ${question.done ? s.wrapper_done : ""}`}
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
              <div
                className={`${s.mark}`}
              >
                {question.done ? <DoneSVG /> : null}
                {question.active ? <ActiveSVG /> : null}
                {!question.done && !question.active ? <DisableSVG /> : null}
              </div>

              <div
                className={`${s.line} ${
                  index !== data.length - 1 ? s.line_visible : ""
                }`}
              ></div>
            </div>
            <div
              className={`${s.item}`}
            >
              <div
                className={`${s.triangle}`}
              ></div>
              <div className={s.header_item}>
                <div className={s.item_text} onClick={() => handleClick(index)}>
                  <div className={s.title}>{question.title}</div>
                  <div className={s.text}>{question.question}</div>
                </div>
                <div
                  className={`${s.edit_button}`}
                >
                  <IconButton onClick={() => handleClickEdit(index)}>
                    <EditSVG />
                  </IconButton>
                </div>
              </div>
              <div
                className={`${s.actions}`}
              >
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
      width="96"
      height="95"
      viewBox="0 0 96 95"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_5329_22811)">
        <circle cx="48" cy="43.5" r="31.5" fill="white" />
      </g>
      <path
        d="M57.8555 38.3436C57.8555 44.6438 51.1145 44.7408 51.1145 47.069V47.6644C51.1145 48.2871 50.6144 48.7919 49.9975 48.7919H45.7487C45.1318 48.7919 44.6317 48.2871 44.6317 47.6644V46.8508C44.6317 43.4922 47.1542 42.1497 49.0604 41.0708C50.695 40.1458 51.6968 39.5166 51.6968 38.2916C51.6968 36.6711 49.6491 35.5956 47.9937 35.5956C45.8352 35.5956 44.8388 36.627 43.4381 38.4115C43.0605 38.8925 42.3714 38.9819 41.8868 38.611L39.297 36.6287C38.8216 36.2649 38.7151 35.5889 39.0509 35.0912C41.2501 31.8314 44.0512 30 48.4124 30C52.98 30 57.8555 33.599 57.8555 38.3436ZM51.7825 54.0537C51.7825 56.2297 50.0288 58 47.8731 58C45.7175 58 43.9637 56.2297 43.9637 54.0537C43.9637 51.8777 45.7175 50.1074 47.8731 50.1074C50.0288 50.1074 51.7825 51.8777 51.7825 54.0537Z"
        fill="#814EFA"
      />
      <defs>
        <filter
          id="filter0_d_5329_22811"
          x="0.5"
          y="0"
          width="95"
          height="95"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="8" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_5329_22811"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_5329_22811"
            result="shape"
          />
        </filter>
      </defs>
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
        clip-rule="evenodd"
        d="M18.478 24.5L13.2402 19.8839L14.8214 18.4901L18.478 21.7124L26.6591 14.5L28.2402 15.8948L18.478 24.5Z"
        fill="white"
      />
    </svg>
  );
}
