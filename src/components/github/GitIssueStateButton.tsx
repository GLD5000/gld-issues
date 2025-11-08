import React, { SyntheticEvent, useState } from "react";
import { getIssueDeadlineDateObject, SelectiveIssue } from "./useIssues";
import {
  getCurrentWeekNumber,
  getWeekNumberFromISOString,
  getWeekNumberFromMilliseconds,
} from "@/utils/dates";
import LoadingSpinner from "./LoadingSpinner";

const optionsArray = [
  "Completed",
  "Overdue",
  "Blocked",
  "Priority",
  "Queued",
  "Open",
  "Progressing",
  "Testing",
];

export default function GitIssueStateButton({
  issue,
  setIssues,
  lastUpdated,
}: {
  issue: SelectiveIssue;
  setIssues: (
    type?: string, //eslint-disable-line
    body?: //eslint-disable-line
    {
      [key: string]: string;
    },
  ) => {};
  lastUpdated: string;
}) {
  const [previousUpdated, setPreviousUpdated] = useState("");
  const progressState = getProgressState(issue);
  const options =
    issue.state === "closed"
      ? [
          <option key="open" value={"Open"}>
            {"Open"}
          </option>,
          <option key="closed" className="hidden" value={"Completed"}>
            {"Completed"}
          </option>,
        ]
      : optionsArray.map((name) => (
          <option
            key={name}
            className={`${name === progressState.msg || name === "Open" || (name === "Progressing" && progressState.msg !== "Blocked" && progressState.msg !== "Priority") || name === "Overdue" || name === "Queued" ? "hidden" : "block"}`}
            value={name}
          >
            {name}
          </option>
        ));
  function handleClick(e: SyntheticEvent<HTMLSelectElement>) {
    let newValue = e.currentTarget.value;
    if (newValue === "Completed" || newValue === "Open") {
      setIssues("close", {
        issue_number: `${issue.number}`,
        current_state: `${issue.state}`,
      });
      setPreviousUpdated(lastUpdated);
    } else if (
      newValue === "Blocked" ||
      newValue === "Priority" ||
      newValue === "Progressing" ||
      newValue === "Testing"
    ) {
      const newLabels = getNewLabelsListString(issue, newValue);
      setIssues("patchTodo", {
        issue_number: `${issue.number}`,
        labels: newLabels,
      });
      setPreviousUpdated(issue.updated_at);
    }
  }
  if (previousUpdated === lastUpdated)
    return (
      <div className="ml-auto w-36 h-7 box-border p-1 text-center rounded-none border-none bg-neutral-500">
        <LoadingSpinner />
      </div>
    );
  return (
    <select
      aria-label="Issue State"
      className={`appearance-none block cursor-pointer p-1 box-border w-36 h-[30px] text-center rounded-none border-none text-black ${progressState.bg || "bg-black"} hover:bg-white focus:bg-white`}
      value={progressState.msg}
      onChange={handleClick}
    >
      {options}
    </select>
  );
}

function getProgressState(issue: SelectiveIssue) {
  const isAwaiting = getIsAwaiting(issue);
  const isTesting = getIsTesting(issue);
  const isPriority = getIsPriority(issue);
  const isProgressing = getIsProgressing(issue);
  const deadlineDate = getIssueDeadlineDateObject(issue);
  const issueMilliseconds = deadlineDate ? deadlineDate.valueOf() : -1;
  const nowMilliseconds = Date.now();
  const currentWeek = getWeekNumberFromMilliseconds(nowMilliseconds);
  const issueDeadlineWeek = getWeekNumberFromMilliseconds(issueMilliseconds);
  const isOverdue =
    issueMilliseconds > -1 ? issueMilliseconds < nowMilliseconds : false;
  const isDueSoon =
    issueDeadlineWeek === currentWeek || issueDeadlineWeek === currentWeek + 1;
  if (issue.state === "closed") {
    return { msg: "Completed", bg: "bg-blue-300" };
  } else if (isAwaiting) {
    return { msg: "Blocked", bg: "bg-pink-300" };
  } else if (isTesting) {
    return { msg: "Testing", bg: "bg-neutral-200" };
  } else if (isPriority || isDueSoon) {
    return { msg: "Priority", bg: "bg-lime-200" };
  } else if (isOverdue) {
    return { msg: "Overdue", bg: "bg-red-300" };
  } else if (isProgressing) {
    return { msg: "Progressing", bg: "bg-green-300" };
  } else if (deadlineDate) {
    return { msg: "Queued", bg: "bg-orange-300" };
  }
  return { msg: "Open", bg: "bg-teal-300" };
}
function getIsAwaiting(issue: SelectiveIssue) {
  return issue.labels.some((label) => label.name === "awaiting");
}

function getIsPriority(issue: SelectiveIssue) {
  return issue.labels.some((label) => label.name === "priority");
}
function getIsTesting(issue: SelectiveIssue) {
  return issue.labels.some((label) => label.name === "testing");
}
function getIsProgressing(issue: SelectiveIssue) {
  return (
    issue.updated_at !== issue.created_at &&
    getCurrentWeekNumber() === getWeekNumberFromISOString(issue.updated_at)
  );
}
function getNewLabelsListString(issue: SelectiveIssue, newValue: string) {
  const currentLabelNames = issue.labels
    .map((label) => label.name)
    .filter(
      (name) =>
        name !== "awaiting" && name !== "priority" && name !== "testing",
    );

  if (newValue === "Blocked") {
    return [...currentLabelNames, "awaiting"].join(",");
  } else if (newValue === "Priority") {
    return [...currentLabelNames, "priority"].join(",");
  } else if (newValue === "Testing") {
    return [...currentLabelNames, "testing"].join(",");
  } else {
    return currentLabelNames.join(",");
  }
}
