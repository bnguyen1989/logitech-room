interface PropsI {
  type?: "single" | "double" | "all";
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
          stroke-width="8"
        />
      </svg>
    );
  }

  if (type === "double") {
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
  }

  return (
    <svg
      width="31"
      height="22"
      viewBox="0 0 31 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4.3"
        y="0.3"
        width="26.2189"
        height="17.4"
        rx="2.7"
        fill="white"
        stroke="#814EFA"
        strokeWidth="0.6"
      />
      <rect
        x="2.3"
        y="2.3"
        width="26.2189"
        height="17.4"
        rx="2.7"
        fill="white"
        stroke="#814EFA"
        strokeWidth="0.6"
      />
      <rect
        x="0.3"
        y="4.3"
        width="26.2189"
        height="17.4"
        rx="2.86265"
        fill="white"
        stroke="#814EFA"
        strokeWidth="0.6"
      />
      <rect
        x="2.46621"
        y="6.43874"
        width="21.8864"
        height="13.1225"
        rx="1.39157"
        stroke="#814EFA"
        strokeWidth="0.506024"
      />
      <path
        d="M11.625 15.1063L9.45627 12.9375C9.21252 12.6938 8.81877 12.6938 8.57502 12.9375C8.33127 13.1813 8.33127 13.575 8.57502 13.8188L11.1875 16.4313C11.4313 16.675 11.825 16.675 12.0688 16.4313L18.6813 9.81876C18.925 9.57501 18.925 9.18126 18.6813 8.93751C18.4375 8.69376 18.0438 8.69376 17.8 8.93751L11.625 15.1063Z"
        fill="#814EFA"
      />
    </svg>
  );
};
