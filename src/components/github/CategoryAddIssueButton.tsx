"use client";
import React, { useRef, useState } from "react";
// import LoadingSpinner from './LoadingSpinner';

export default function CategoryAddIssueButton({
  label,
  width = "w-[30em]",
  textAlign = "text-left",
  // isLoading = false,
  setIssues,
  title,
  displayText = "Add Issue",
}: {
  label: string;
  width?: string;
  textAlign?: string;
  // isLoading?: Boolean;
  setIssues: (
    type?: string, //eslint-disable-line
    //eslint-disable-next-line
    body?: {
      [key: string]: string; //eslint-disable-line
    }, //eslint-disable-line
  ) => {}; //eslint-disable-line
  title?: string;
  displayText?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(title || "");
  const dateIndex = title?.search(/\d\d\/\d\d\/\d\d/);
  const inputRef = useRef<HTMLInputElement>(null);

  // if (isLoading)
  //     return (
  //         <div
  //             className={`block text-black dark:text-white bg-transparent ${width} text-ellipsis ${textAlign} border-none`}
  //         >
  //             <LoadingSpinner />
  //         </div>
  //     );
  return (
    <>
      {isEditing ? (
        <input
          placeholder={"Issue Title dd/mm/yy"}
          ref={inputRef}
          className={`block text-black dark:text-white bg-transparent ${width} text-ellipsis ${textAlign} border-none`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          onBlur={(e) => {
            onBlurHandler(e);
            setIsEditing(false);
            setInputValue("");
          }}
          onChange={(e) => {
            setInputValue(e.currentTarget.value);
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
        <button
          onClick={handleClick}
          type="button"
          className="text-center grid grid-cols-[auto_auto] items-center gap-2 text-xs border-none w-24 h-[20px] m-0 bg-transparent p-0 text-neutral-500 dark:text-neutral-400 transform-none aspect-square hover:text-black focus:text-black hover:dark:text-white focus:dark:text-white transition box-border"
        >
          <svg
            role="decoration"
            height="20px"
            width="20px"
            className="block stroke-current stroke-2 border-current border-2 border-solid rounded-full w-[20px] h-[20px] m-0 box-border"
            viewBox="0 0 16 16"
          >
            <g>
              <path d="M 8,4 V 12"></path>
              <path d="M 4,8 H 12"></path>
            </g>
          </svg>
          {displayText && (
            <span className="block m-0 w-max h-auto box-border">
              {displayText}
            </span>
          )}
        </button>
      )}
    </>
  );
  function handleClick() {
    setIsEditing(true);
    setTimeout(() => {
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.value = title || "";
        inputRef.current.selectionStart = inputRef.current.selectionEnd =
          Number(dateIndex) - 1;
      }
    }, 0);
  }
  function onBlurHandler(e: React.FocusEvent<HTMLInputElement>) {
    if (
      e.currentTarget.value &&
      e.currentTarget.value.trim().length > 0 &&
      e.currentTarget.value !== title
    ) {
      const setIssueParams: Record<string, string> = {
        title: e.currentTarget.value,
        labels: label,
      };
      setIssues("new", setIssueParams);
    }
  }
}
