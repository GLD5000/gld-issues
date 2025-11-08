import React from "react";
import { SelectiveIssue } from "./useIssues";
import GitIssueCard from "./GitIssueCard";

export default function IssueCards({
  issueArray,
  setIssues,
  listIssueArray,
  setListIssue,
  lastUpdated,
}: {
  issueArray: SelectiveIssue[];
  setIssues: (
    //eslint-disable-next-line
    type?: string,
    //eslint-disable-next-line
    body?: {
      [key: string]: string;
    },
  ) => {};
  listIssueArray: string[];
  //eslint-disable-next-line
  setListIssue: (valueIn: string | string[]) => void;
  lastUpdated: string;
}) {
  return (
    <div className="grid gap-0 rounded border border-solid border-neutral-400 dark:border-neutral-500 p-0 overflow-clip">
      {issueArray.map((issue, index) => {
        return (
          <GitIssueCard
            key={`${index}${issue.number}`}
            issue={issue}
            setIssues={setIssues}
            listIssueArray={listIssueArray}
            setListIssue={setListIssue}
            lastUpdated={lastUpdated}
            className={
              index === issueArray.length - 1
                ? ""
                : "border-0 border-b border-solid border-b-neutral-400 dark:border-b-neutral-500"
            }
          />
        );
      })}
    </div>
  );
}
