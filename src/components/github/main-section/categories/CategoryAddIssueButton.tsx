"use client";
import { useRef, useState } from "react";
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
  // isLoading?: boolean;
  setIssues: (
    type?: string,

    body?: {
      [key: string]: string;
    },
  ) => void;
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
            if (!document.hasFocus()) {
              const el = e.currentTarget;
              window.addEventListener("focus", () => el.focus(), {
                once: true,
              });
              return;
            }
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
          className="text-center grid grid-cols-[auto_auto] items-center gap-2 text-xs border-none w-24 h-5 m-0 bg-transparent p-0 text-neutral-500 dark:text-neutral-400 transform-none aspect-square hover:text-black focus:text-black hover:dark:text-white focus:dark:text-white transition box-border"
        >
          <svg
            role="decoration"
            height="20px"
            width="20px"
            className="block stroke-current stroke-2 border-current border-2 border-solid rounded-full w-5 h-5 m-0 box-border"
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
    // Abort blur handler when tab / window switching
    if (!document.hasFocus()) return;
    const value = e.currentTarget.value;
    // Return unchanged for blank or no difference
    if (!value || value.trim().length === 0 || value === title) return;
    // Return normal (non-link) titles
    if (!value.startsWith("https"))
      return setIssues("new", { title: value, labels: label });

    const parsed = parseLinks(value.trim());
    const setIssueParams: Record<string, string> = parsed
      ? parsed
      : { title: value, labels: label };
    setIssues("new", setIssueParams);
  }
  function parseGitLabLink(
    value: string,
  ): { title: string; body: string; labels: string } | null {
    // Return if not a Gitlab URL ending with a digit
    if (!/\d$/.test(value)) return null;
    const [repoSlug, , itemType, itemNumber] = value.split("/").slice(-4);
    const newLabel =
      itemType.indexOf("merge") > -1
        ? "bau: merge requests"
        : itemType.indexOf("work") > -1
          ? "bau: issues"
          : label;
    const repoTitle = repoSlug
      .split("-")
      .map((w) =>
        w.length <= 3
          ? w.toUpperCase()
          : w.charAt(0).toUpperCase() + w.slice(1),
      )
      .join(" ");
    return {
      title: `${repoTitle} | ${itemNumber}`,
      body: value,
      labels: newLabel,
    };
  }
  function parseJiraLink(
    value: string,
  ): { title: string; body: string; labels: string } | null {
    // Return if not a Gitlab URL ending with a digit
    if (!/\d$/.test(value)) return null;
    const itemCode = value.split("/").at(-1);
    return {
      title: `JIRA | ${itemCode}`,
      body: value,
      labels: "bau: issues",
    };
  }

  function parseLinks(value: string) {
    if (value.indexOf("gitlab") > -1) return parseGitLabLink(value);
    if (value.indexOf("atlassian") > -1) return parseJiraLink(value);
    return null;
  }
}
