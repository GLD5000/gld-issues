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
        if (!document.hasFocus()) {
          const el = e.currentTarget;
          window.addEventListener("focus", () => el.focus(), { once: true });
          return;
        }
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
