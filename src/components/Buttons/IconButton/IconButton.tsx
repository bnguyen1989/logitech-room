import s from "./IconButton.module.scss";
import React from "react";

interface PropsI {
  children: React.ReactNode;
  text?: string;
  onClick: () => void;
  style?: React.CSSProperties;
  variant?: "text" | "outlined" | "contained";
  position?: "left" | "right";
  disabled?: boolean;
}
export const IconButton: React.FC<PropsI> = (props) => {
  const {
    children,
    text,
    onClick,
    style,
    variant = "text",
    position = "right",
    disabled,
  } = props;

  return (
    <div
      style={style}
      className={`${s.container} ${s["button_" + variant]} ${
        disabled ? s.disabled : ""
      } ${children && !text ? s.only_icon : ""}`}
      onClick={() => onClick()}
    >
      {position === "left" && <div className={s.icon}>{children}</div>}
      {!!text && (
        <div
          className={s.text}
          dangerouslySetInnerHTML={{ __html: text }}
        ></div>
      )}
      {position === "right" && <div className={s.icon}>{children}</div>}
    </div>
  );
};
