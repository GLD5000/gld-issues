import { useState } from "react";

export default function NewTaskInput({
  onBlurHandler,
}: {
  onBlurHandler: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <input
      placeholder={"Add new task..."}
      className={`block font-normal text-black dark:text-white bg-transparent w-60 max-w-full text-ellipsis border-none`}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      onBlur={(e) => {
        onBlurHandler(e);
        setValue("");
      }}
      onChange={(e) => {
        const newValue = e.currentTarget.value;
        setValue(newValue);
      }}
      //   onKeyDownCapture={(e) => {
      //     if (e.key === " ") {
      //       e.preventDefault();
      //       const currentCharacter = e.currentTarget.selectionStart || 0;
      //       const currentString = e.currentTarget.value;
      //       const prependString = currentString.slice(0, currentCharacter);
      //       const appendString = currentString.slice(currentCharacter);
      //       // Insert space character manually
      //       e.currentTarget.value = `${prependString} ${appendString}`;
      //       // Move cursor to the end of the e.currentTarget
      //       e.currentTarget.setSelectionRange(
      //         currentCharacter + 1,
      //         currentCharacter + 1
      //       );
      //     }
      //   }}
      value={value}
    />
  );
}
