import React from 'react';
import s from './Switcher.module.scss';

interface PropsI {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}
export const Switcher: React.FC<PropsI> = (props) => {
  const { label, value, onChange } = props;

  return (
    <div className={s.container}>
      <div className={s.content}>
        {!!label && <div className={s.label}>{label}</div>}
      </div>
      <label className={s.switch}>
        <input
          type={'checkbox'}
          checked={value}
          onChange={() => onChange(!value)}
        />
        <span className={s.slider}></span>
      </label>
    </div>
  );
};