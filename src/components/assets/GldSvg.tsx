export default function GldSvg({
  wrapperClasses = " pointer-events-none mx-auto h-full w-full fill-current",
}) {
  return (
    <div className={wrapperClasses}>
      <svg
        id="gld-svg"
        role="img"
        aria-label="GLD"
        height="100%"
        width="100%"
        viewBox="0 0 16 16"
      >
        <g>
          <path
            d="M 6,2 H 2 V 3 H 1 V 10 H 2 V 11 H 6 V 6 H 4 v 2 h 1 v 1 H 3 V 4 H 4 v 1 h 2 z"
            id="path510"
          />
          <path d="M 10,14 H 7 l -1e-7,-10 H 9 l 10e-8,8 H 10 Z" id="path512" />
          <path
            id="path514"
            d="m 10,2 v 9 h 4 v -1 h 1 V 3 H 14 V 2 Z m 2,2 h 1 v 5 h -1 z"
          />
        </g>
      </svg>
    </div>
  );
}
