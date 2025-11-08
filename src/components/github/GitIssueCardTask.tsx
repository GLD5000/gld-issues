import TickSvg from "@/icons/TickSvg";
import UnTicked from "@/icons/UnTicked";
import React from "react";

export default function GitIssueCardTask({
  task,
  issueNumber,
  setIssues,
}: {
  task: string;
  issueNumber: number;
  setIssues: (
    type?: string, //eslint-disable-line
    body?: //eslint-disable-line
    {
      [key: string]: string;
    },
  ) => {};
}) {
  return (
    <button
      type="button"
      onClick={clickHandler}
      className="border-none items-center text-sm p-0 m-0 font-inherit bg-transparent h-auto w-full text-left grid grid-cols-[auto_1fr]"
    >
      <span className="block h-7 w-7 p-1.5">
        {task.indexOf("[x]") > -1 ? <TickSvg /> : <UnTicked />}
      </span>
      <span className="block">{task.replace(/- \[[ x]\]/, "")}</span>
    </button>
  );
  function clickHandler() {
    console.log(setIssues);
    console.log(issueNumber);
  }
}
