const TypingSvg = () => {
  return (
    <svg
      width="40"
      height="10"
      viewBox="0 0 40 10"
      xmlns="http://www.w3.org/2000/svg"
      fill="#555"
    >
      <circle cx="5" cy="5" r="3">
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="1.4s"
          repeatCount="indefinite"
          begin="0s"
        />
      </circle>
      <circle cx="20" cy="5" r="3">
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="1.4s"
          repeatCount="indefinite"
          begin="0.2s"
        />
      </circle>
      <circle cx="35" cy="5" r="3">
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="1.4s"
          repeatCount="indefinite"
          begin="0.4s"
        />
      </circle>
    </svg>
  );
};

export default TypingSvg;
