import { useState } from "react";

export default function AddNewTodo({
  onBlurHandler,
}: {
  onBlurHandler: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <input
      placeholder={"Add new task..."}
      className={`block font-normal text-black dark:text-white bg-transparent w-full text-ellipsis border-none`}
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
      value={value}
    />
  );
}
