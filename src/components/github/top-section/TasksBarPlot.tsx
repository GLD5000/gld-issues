import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface TasksBarPlot extends ComponentProps<"div"> {
  barNumbers: number[];
  barColours?: string[];
  height: number;
}

export default function TasksBarPlot({
  barNumbers,
  barColours,
  height,
  className,
  ...props
}: TasksBarPlot) {
  return (
    <div
      className={twMerge(
        "flex w-full mb-1 p-0 m-0 box-border rounded-md overflow-clip",
        className,
      )}
      style={{ height }}
      {...props}
    >
      {(
        barColours || [
          "bg-blue-400 dark:bg-blue-300",
          "bg-neutral-400 dark:bg-neutral-300",
          "bg-green-400 dark:bg-green-300",
          "bg-pink-400 dark:bg-pink-300",
        ]
      ).map((colour, index) => (
        <div
          style={{ flexGrow: barNumbers[index] }}
          key={`${colour}-${index}`}
          className={`box-border ${colour}`}
        ></div>
      ))}
    </div>
  );
}
