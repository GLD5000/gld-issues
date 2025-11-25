import TickSvg from "@/icons/TickSvg";
import TickSvgV2 from "@/icons/TickSvgV2";
import UnTicked from "@/icons/UnTicked";

export default function GitIssueCardBodyTodo({
  task,
  todoTaskClickHandler,
  deleteTodoClickHandler,
}: {
  task: string;
  todoTaskClickHandler: () => void;
  deleteTodoClickHandler: () => void;
}) {
  const isTicked = task.indexOf("[x]") > -1;
  return (
    <div className="flex w-fit gap-4 align-middle justify-items-start">
      <button
        type="button"
        onClick={todoTaskClickHandler}
        className="border-none items-center text-sm p-0 m-0 font-medium    h-auto w-full text-left grid grid-cols-[auto_1fr] cursor-pointer"
      >
        <span className="block h-4.5 w-4.5 rounded-md bg-transparent mb-auto border border-current border-solid text-neutral-500 dark:text-neutral-400 hover:text-black focus:text-black hover:dark:text-white focus:dark:text-white transition box-border">
          {isTicked && <TickSvgV2 />}
        </span>
      </button>
      <span className="block">{task.replace(/- \[[ x]\]/, "")}</span>
      <button
        type="button"
        onClick={deleteTodoClickHandler}
        className="block h-4.5 w-4.5 shrink-0 leading-0 rounded-md bg-transparent mb-auto border border-current border-solid text-neutral-500 dark:text-neutral-400 hover:text-black focus:text-black hover:dark:text-white focus:dark:text-white transition box-border"
      >
        <svg
          role="img"
          aria-label="Toggle On"
          width="100%"
          height="100%"
          viewBox="0 0 16 16"
        >
          <path
            className="stroke-current stroke-1"
            d="M 4,4 12,12 M 4,12 12,4"
            style={{
              strokeLinecap: "round",
              fill: "none",
            }}
          />
        </svg>
      </button>
    </div>
  );
}
