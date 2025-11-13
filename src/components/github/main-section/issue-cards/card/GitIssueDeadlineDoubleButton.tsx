"use client";

import {
  adjustDateToPreviousWorkday,
  dateIsFri,
  dateIsSatSun,
  getDayOfWeekShort,
  getWeekNumberFromMilliseconds,
  timeDiffWorkDays,
} from "@/utils/dates";
import {
  getAdjustedDeadlineDate,
} from "../../../useIssues/useIssuesUtils";
import { SelectiveIssue } from "../../../useIssues/useIssuesTypes";
import {
  useDeadlineViewMode,
} from "../../../useIssues/useIssuesParameterHooks";
import DeadlineFlagButton from "../../categories/DeadlineFlagButton";

export default function GitIssueDeadlineDoubleButton({
  issue,
}: {
  issue: SelectiveIssue;
}) {
  const [deadlineViewMode, toggleDeadlineViewMode] = useDeadlineViewMode();
  const deadlineDate = getAdjustedDeadlineDate(issue);
  if (!deadlineDate || issue.state === "closed") return null;
  const deadlineData = getProgressState(deadlineDate);
  if (!deadlineData) return null;

  const buildData = getProgressState(adjustDateToPreviousWorkday(deadlineDate));
  const deadlineFlagValue = deadlineViewMode === "days" ? buildData.msg : buildData.week;
  const deadlineFlagColour = deadlineData.border;
  return (
    <div
      className={`flex justify-end gap-0 text-sm w-fit ml-auto mr-0.5 box-border rounded-none border-none p-0`}
    >
      <DeadlineFlagButton
        handleDeadlineViewClick={toggleDeadlineViewMode}
        deadlineFlagColour={deadlineFlagColour}
        deadlineFlagValue={deadlineFlagValue}
      />
    </div>
  );
}

export function getProgressState(deadlineDate: Date) {
  const buildDay = deadlineDate;
  const currentDay = new Date(new Date().toISOString().split("T")[0]);
  const isWeekend = dateIsSatSun(currentDay);
  const isFriday = dateIsFri(currentDay);
  const daysToBuild = timeDiffWorkDays(currentDay, buildDay);
  const issueMilliseconds = buildDay.valueOf();
  const nowMilliseconds = currentDay.valueOf();
  const currentWeek = getWeekNumberFromMilliseconds(nowMilliseconds);
  const issueDeadlineWeek = getWeekNumberFromMilliseconds(issueMilliseconds);
  const isOverdue = daysToBuild < 0;
  const isDueThisWeek = issueDeadlineWeek === currentWeek;
  const isDueNextWeek = issueDeadlineWeek === currentWeek + 1;
  const dueInTwoWeeks = issueDeadlineWeek === currentWeek + 2;
  const dueMessage = getDueMessage(daysToBuild, isWeekend, isFriday);
  const weekMessage = `${getDayOfWeekShort(buildDay)} ${buildDay.getDate()} - wk ${issueDeadlineWeek}`;
  if (isOverdue) {
    return {
      week: weekMessage,
      msg: dueMessage,
      border: "border-red-300",
    }; 
  } else if (isDueThisWeek) {
    return {
      week: weekMessage,
      msg: dueMessage,
      border: "border-red-300",
    };
  } else if (isDueNextWeek) {
    return {
      week: weekMessage,
      msg: dueMessage,
      border: "border-orange-300",
    };
  } else if (dueInTwoWeeks) {
    return {
      week: weekMessage,
      msg: dueMessage,
      border: "border-green-300",
    };
  } else {
    return {
      week: weekMessage,
      msg: dueMessage,
      border: "border-blue-300",
    };
  }
}

function getDueMessage(days: number, isWeekend: Boolean, isFriday: Boolean) {
  if (days < 0) {
    return "Overdue";
  } else if (days === 0) {
    return isWeekend ? "Monday" : "Today";
  } else if (days === 1) {
    return isWeekend ? "Tuesday" : isFriday ? "Monday" : "Tomorrow";
  } else {
    return `${days} workdays`;
  }
}
