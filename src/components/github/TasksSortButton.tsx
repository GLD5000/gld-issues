import React from "react";

export default function TasksSortButton({
  incrementSortMode,
  sortMode,
}: {
  incrementSortMode: () => void;
  sortMode: string;
}) {
  return (
    <label className="grid grid-cols-[auto_auto] gap-6 relative p-1 box-border border-none text-sm cursor-pointer w-fit h-fit my-auto text-left rounded-none text-neutral-500 dark:text-neutral-400 items-center font-light bg-transparent">
      Sort by:
      <button
        className="grid relative cursor-pointer p-1 box-border w-36 h-fit my-auto text-sm text-center text-black dark:text-white items-center border border-solid bg-transparent border-neutral-500 dark:border-neutral-400 rounded"
        type="button"
        onClick={() => {
          incrementSortMode();
        }}
      >
        {sortMode}
      </button>
    </label>
  );
}
