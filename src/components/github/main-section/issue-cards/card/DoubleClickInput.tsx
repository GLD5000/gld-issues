import { useRef, useState } from "react";
import LoadingSpinner from "../../../LoadingSpinner";

export default function DoubleClickInput({
  onBlurHandler,
  onChangeHandler,
  onClickHandler,
  inputValue,
  displayValue,
  placeHolder,
  width = "w-[30em]",
  textAlign = "text-left",
  isLoading = false,
}: {
  onBlurHandler: (e: React.FocusEvent<HTMLInputElement>) => void;

  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickHandler?: () => void;
  inputValue: string;
  displayValue?: string;
  placeHolder?: string;
  width?: string;
  textAlign?: string;
  isLoading?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };
  if (isLoading)
    return (
      <div
        className={`block text-black dark:text-white bg-transparent ${width} text-ellipsis ${textAlign} border-none`}
      >
        <LoadingSpinner />
      </div>
    );
  return (
    <>
      {isEditing ? (
        <input
          placeholder={placeHolder}
          ref={inputRef}
          className={`block text-black dark:text-white bg-transparent ${width} text-ellipsis ${textAlign} border-none`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          onBlur={(e) => {
            onBlurHandler(e);
            // setTimeout(() => {
            //     if (inputRef && inputRef.current) {
            //         inputRef.current.blur();
            //     }
            // }, 0)
            setIsEditing(false);
          }}
          onChange={(e) => {
            onChangeHandler(e);
          }}
          onKeyDownCapture={(e) => {
            if (e.key === " ") {
              e.preventDefault();
              const currentCharacter = e.currentTarget.selectionStart || 0;
              const currentString = e.currentTarget.value;
              const prependString = currentString.slice(0, currentCharacter);
              const appendString = currentString.slice(currentCharacter);
              // Insert space character manually
              e.currentTarget.value = `${prependString} ${appendString}`;
              // Move cursor to the end of the e.currentTarget
              e.currentTarget.setSelectionRange(
                currentCharacter + 1,
                currentCharacter + 1,
              );
            }
          }}
          value={inputValue}
        ></input>
      ) : (
        <span
          className={`block text-black dark:text-white bg-transparent ${width} text-ellipsis ${textAlign} border-none whitespace-pre overflow-clip cursor-text`}
          onDoubleClick={() => {
            handleDoubleClick();
            if (onClickHandler) onClickHandler();
          }}
          onClick={(e) => {
            // e.stopPropagation();
            e.preventDefault();
          }}
        >
          {displayValue || placeHolder || inputValue}
        </span>
      )}
    </>
  );
}
