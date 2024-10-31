interface PropsI {
  type?: "single" | "double";
}
export const DisplaySVG: React.FC<PropsI> = (props) => {
  const { type = "single" } = props;

  if (type === "single") {
    return (
      <svg
        width="412"
        height="280"
        viewBox="0 0 412 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="5"
          y="5"
          width="402"
          height="270"
          rx="45"
          stroke="black"
          strokeWidth="10"
        />
        <rect
          x="38"
          y="38"
          width="336"
          height="204"
          rx="22"
          stroke="black"
          strokeWidth="8"
        />
      </svg>
    );
  }

  return (
    <svg
      width="855"
      height="280"
      viewBox="0 0 855 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="5"
        width="402"
        height="270"
        rx="45"
        stroke="black"
        strokeWidth="10"
      />
      <rect
        x="441"
        y="5"
        width="402"
        height="270"
        rx="45"
        stroke="black"
        strokeWidth="10"
      />
      <rect
        x="474"
        y="38"
        width="336"
        height="204"
        rx="22"
        stroke="black"
        strokeWidth="8"
      />
      <rect
        x="38"
        y="38"
        width="336"
        height="204"
        rx="22"
        stroke="black"
        strokeWidth="8"
      />
    </svg>
  );
};
