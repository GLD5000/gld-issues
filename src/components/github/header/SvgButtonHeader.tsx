import { type MouseEvent, type ReactElement, useState } from "react";

function getContent(
  reverse: boolean,
  showText: boolean,
  textElement: ReactElement | null,
  svg: ReactElement,
) {
  return reverse ? (
    <>
      {showText && textElement}
      {svg}
    </>
  ) : (
    <>
      {svg}
      {showText && textElement}
    </>
  );
}

export default function SvgButtonHeader({
  type = "button",
  clickFunction,
  id,
  name,
  showTextIn = undefined,
  reverse = false,
  svg,
  textElement = null,
  className = `grid-cols-frAutoFr w-full h-full
   hover:border-current
   grid     
      rounded border border-solid whitespace-pre-wrap hover:transition
    `,
}: {
  type?: "button" | "submit" | "reset";

  clickFunction: ((e: MouseEvent<HTMLButtonElement>) => void) | (() => void);
  id?: string | undefined;
  name?: string | undefined;
  showTextIn?: boolean | undefined;
  className?: string | undefined;
  reverse?: boolean;
  svg: ReactElement;
  textElement?: ReactElement | null;
}) {
  const [showText, setShowText] = useState(showTextIn ?? false);
  const content = getContent(reverse, showText, textElement, svg);

  return (
    <button
      type={type === "button" ? "button" : "submit"}
      id={id}
      name={name}
      onClick={clickFunction}
      className={`cursor-pointer items-center ${className.replaceAll(
        /[\s]+/g,
        " ",
      )}`}
      aria-label={name}
      onFocus={() => {
        if (showTextIn === undefined) setShowText(true);
      }}
      onMouseEnter={() => {
        if (showTextIn === undefined) setShowText(true);
      }}
      onBlur={() => {
        if (showTextIn === undefined) setShowText(false);
      }}
      onMouseLeave={() => {
        if (showTextIn === undefined) setShowText(false);
      }}
    >
      {content}
    </button>
  );
}
