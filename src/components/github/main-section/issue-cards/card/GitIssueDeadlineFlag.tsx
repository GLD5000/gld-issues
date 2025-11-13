"use client";

import { adjustDateToPreviousWorkday } from "@/utils/dates";
import { SelectiveIssue } from "../../../useIssues/useIssuesTypes";
import {
  getAdjustedDeadlineDate,
} from "../../../useIssues/useIssuesUtils";
import { getProgressState } from "./GitIssueDeadlineDoubleButton";

export default function GitIssueDeadlineFlag({
  issue,
}: {
  issue: SelectiveIssue;
}) {
  const deadlineDate = getAdjustedDeadlineDate(issue);
  if (!deadlineDate || issue.state === "closed") return null;
  const progressState = getProgressState(deadlineDate);
  if (!progressState) return null;
  return (
    <div
      className={`grid relative cursor-default p-1 box-border w-36 h-6 my-auto text-center rounded-none text-black dark:text-white items-center border-2 border-solid ${progressState.border || "border-black dark-border-white"}`}
    >
      <span className="block leading-[0.8]">{progressState.msg}</span>
    </div>
  );
}
