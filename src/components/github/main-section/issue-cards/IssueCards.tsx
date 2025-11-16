import GitIssueCard from "./card/GitIssueCard";
import { SelectiveIssue } from "../../useIssues/useIssuesTypes";

export default function IssueCards({
  issueArray,
  setIssues,
  priorityList,
  setPriorityList,
  lastUpdated,
}: {
  issueArray: SelectiveIssue[];
  setIssues: (
    type?: string,

    body?: {
      [key: string]: string;
    },
  ) => void;
  priorityList: string[];

  setPriorityList: (valueIn: string | string[]) => void;
  lastUpdated: string;
}) {
  return (
    <div className="grid gap-0 rounded p-0 overflow-clip">
      {issueArray.map((issue, index) => {
        return (
          <GitIssueCard
            key={`${index}${issue.number}`}
            issue={issue}
            setIssues={setIssues}
            priorityList={priorityList}
            setPriorityList={setPriorityList}
            lastUpdated={lastUpdated}
            className="border-0 border-b border-solid border-b-neutral-300 dark:border-b-neutral-600"
          />
        );
      })}
    </div>
  );
}
