import s from "./IconButton.module.scss";
import React from "react";

interface PropsI {
  children: React.ReactNode;
  text?: string;
  onClick: () => void;
  style?: React.CSSProperties;
}
export const IconButton: React.FC<PropsI> = (props) => {
  const { children, text, onClick, style } = props;

  return (
    <div style={style} className={s.container} onClick={() => onClick()}>
      {!!text && (
        <div
          className={s.text}
          dangerouslySetInnerHTML={{ __html: text }}
        ></div>
      )}
			<div className={s.icon}>{children}</div>
    </div>
  );
};
