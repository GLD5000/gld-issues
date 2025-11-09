export default function SunSvg({ classes = " fill-current stroke-none  " }) {
  return (
    <svg
      id="untick-svg"
      transform="rotate (40)"
      role="img"
      aria-label="Toggle Off"
      height="100%"
      width="100%"
      viewBox="0 0 32 32"
    >
      <path
        d="M 16.000001,0 C 7.1780397,1.0648961e-7 1.0648961e-7,7.1780396 0,16 0,24.82196 7.1780397,32 16.000001,32 24.821961,32 32,24.82196 32,16 32,7.1780396 24.821961,0 16.000001,0 Z m 0,2.4609375 c 0,1.5390625 0,25.5390625 0,27.0781245 C 8.5083519,29.539062 2.4609375,23.491648 2.4609375,16 2.4609376,8.508352 8.5083519,2.4609376 16.000001,2.4609375 Z"
        style={{
          strokeLinecap: "round",
        }}
        className={classes}
      />
    </svg>
  );
}
