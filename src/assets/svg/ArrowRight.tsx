interface PropsI {
  color?: string;
}
export const ArrowRightSVG: React.FC<PropsI> = (props) => {
  const { color = "black" } = props;

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.4297 7.18742L0.429688 7.18742L0.429688 8.81323L13.4297 8.81323L13.4297 7.18742Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.34025 15.1768L15.5 8.01701L8.30613 0.823131L7.15644 1.97201L13.2023 8.01701L7.19138 14.0279L8.34025 15.1768Z"
        fill={color}
      />
    </svg>
  );
};
