export default function UnTicked({
  classes = "stroke-current stroke-1",
}: {
  classes?: string;
}) {
  return (
    <svg
      id="tick-svg"
      role="img"
      aria-label="Toggle On"
      height="100%"
      width="100%"
      viewBox="0 0 16 16"
    >
      <circle
        cx="8"
        cy="8"
        r="6.5"
        style={{
          strokeLinecap: "round",
          fill: "none",
        }}
        className={classes}
      />
    </svg>
  );
}
