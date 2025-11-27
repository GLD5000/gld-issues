import TickSvgV2 from "@/icons/TickSvgV2";

export default function CompleteTodo({
  todoTaskClickHandler,
  isTicked,
}: {
  todoTaskClickHandler: () => void;
  isTicked: boolean;
}) {
  return (
    <button
      type="button"
      onClick={todoTaskClickHandler}
      className="border-none items-center text-sm p-0 m-0 font-medium    h-auto w-fit text-left grid grid-cols-[auto_1fr] cursor-pointer"
    >
      <span className="block h-4.5 w-4.5 rounded-md bg-transparent mb-auto border border-current border-solid text-neutral-500 dark:text-neutral-400 hover:text-black focus:text-black hover:dark:text-white focus:dark:text-white transition box-border">
        {isTicked && <TickSvgV2 />}
      </span>
    </button>
  );
}
