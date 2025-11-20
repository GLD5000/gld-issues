import { useRef, useState } from "react";
import LoadingSpinner from "../../../LoadingSpinner";

export default function DoubleClickTextArea({
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
  onBlurHandler: (e: React.FocusEvent<HTMLTextAreaElement>) => void;

  onChangeHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClickHandler?: () => void;
  inputValue: string;
  displayValue?: string;
  placeHolder?: string;
  width?: string;
  textAlign?: string;
  isLoading?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
        className={`block font-normal text-black dark:text-white bg-transparent ${width} ${textAlign} border-none`}
      >
        <LoadingSpinner />
      </div>
    );
  return (
    <>
      {isEditing ? (
        <textarea
          placeholder={placeHolder}
          ref={inputRef}
          className={`block p-2 font-normal text-black dark:text-white bg-transparent w-[calc(100%-2rem)] ${textAlign} text-wrap border-none h-40`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              e.currentTarget.blur();
            }
          }}
          onBlur={(e) => {
            onBlurHandler(e);
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
        ></textarea>
      ) : (
        <pre
          className={`block p-1 font-normal text-black dark:text-white bg-transparent w-fit max-w-[calc(100%-2rem)] overflow-x-auto ${textAlign} border-none whitespace-pre overflow-clip cursor-text h-fit`}
          onDoubleClick={() => {
            handleDoubleClick();
            if (onClickHandler) onClickHandler();
          }}
        >
            {displayValue || placeHolder || inputValue}
        </pre>
      )}
    </>
  );
}
