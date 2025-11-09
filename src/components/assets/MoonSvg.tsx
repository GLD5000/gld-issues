export default function MoonSvg({ classes = "stroke-none fill-current " }) {
  return (
    <div className="pointer-events-none h-full w-full">
      <svg
        style={{
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        id="add-svg"
        role="img"
        aria-label="Add Section"
        height="100%"
        width="100%"
        viewBox="0 0 32 32"
      >
        <path
          d="M 17.537566,0.686204 A 14.61891,14.343353 0 0 1 22.346722,8.6957147 14.61891,14.343353 0 0 1 10.963926,25.628936 14.61891,14.343353 0 0 1 1.5899811,24.418383 15.743442,15.446688 0 0 0 17.827816,31.005238 15.743442,15.446688 0 0 0 30.08621,12.769458 15.743442,15.446688 0 0 0 17.537566,0.686204 Z"
          className={classes}
        />
      </svg>
    </div>
  );
}
