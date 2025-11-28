import { useState } from "react";

export default function EditTodo({
  task,
  onBlurHandler,
}: {
  task: string;
  onBlurHandler: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  const [value, setValue] = useState(`${task.replace(/- \[[ x]\]/, "")}`);
  return (
    <input
        placeholder={"Your task here..."}
      className={`block font-normal text-black dark:text-white bg-transparent w-full text-ellipsis border-none`}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      onBlur={(e) => {
        onBlurHandler(e);
      }}
      onChange={(e) => {
        const newValue = e.currentTarget.value;
        setValue(newValue);
      }}
      value={value}
    />
  );
}
