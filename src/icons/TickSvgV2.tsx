export default function TickSvgV2({
  classes = "stroke-current stroke-1",
}: {
  classes?: string;
}) {
  return (
    <svg
      role="img"
      aria-label="Toggle On"
      width="100%"
      height="100%"
      viewBox="0 0 16 16"
    >
      <path
        d="M 3,8 7,13 13,4"
        style={{
          strokeLinecap: "round",
          fill: "none",
        }}
        className={classes}
      />
    </svg>
  );
}
