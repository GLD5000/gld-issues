import TickSvg from "@/icons/TickSvg";
import UnTicked from "@/icons/UnTicked";

export default function GitIssueCardBodyTodo({
  task,
  clickHandler,
}: {
  task: string;
  clickHandler: () => void;
}) {
  const isTicked = task.indexOf("[x]") > -1;
  return (
    <button
      type="button"
      onClick={clickHandler}
      className="border-none items-center text-sm p-0 m-0 font-inherit bg-transparent h-auto w-full text-left grid grid-cols-[auto_1fr] cursor-pointer"
    >
      <span className="block h-7 w-7 p-1.5 mb-auto">
        {isTicked ? <TickSvg /> : <UnTicked />}
      </span>
      <span className="block">{task.replace(/- \[[ x]\]/, "")}</span>
    </button>
  );
}
