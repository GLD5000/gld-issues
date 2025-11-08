import { CSSProperties } from "react";

export default function DuplicateSvg({
  classes = "stroke-1 fill-none stroke-current",
}) {
  const styles: CSSProperties | undefined = {
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  return (
    <div className="pointer-events-none h-full w-full">
      <svg
        id="duplicate-svg"
        role="img"
        aria-label="copy"
        height="100%"
        width="100%"
        viewBox="0 0 16 16"
      >
        <path d="M 11,2 H 2 v 9" className={classes} style={styles} />
        <rect
          x="4"
          y="4"
          width="9"
          height="9"
          className={classes}
          style={styles}
        />
      </svg>
    </div>
  );
}
// rx="1"
