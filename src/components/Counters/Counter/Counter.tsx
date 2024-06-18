import s from "./Counter.module.scss";

interface PropsI {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  dataAnalytics?: string;
}
export const Counter: React.FC<PropsI> = (props) => {
  const { min, max, onChange, value, disabled, dataAnalytics } = props;

  const handleDecrement = () => {
    if (disabled) return;
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (disabled) return;
    if (value < max) {
      onChange(value + 1);
    }
  };
  return (
    <div className={`${s.container} ${disabled ? s.container_disabled : ""}`}>
      <div
        className={s.decrement}
        onClick={handleDecrement}
        data-analytics-title={dataAnalytics + "-decrement"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="2"
          viewBox="0 0 10 2"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.833008 1.72915H9.16634V0.270813H0.833008V1.72915Z"
            fill="black"
          />
        </svg>
      </div>
      <div className={s.value}>{value}</div>
      <div
        className={s.increment}
        onClick={handleIncrement}
        data-analytics-title={dataAnalytics + "-increment"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.27051 4.27081V0.833313H5.72884V4.27081H9.16634V5.72915H5.72884V9.16665H4.27051V5.72915H0.833008V4.27081H4.27051Z"
            fill="black"
          />
        </svg>
      </div>
    </div>
  );
};
