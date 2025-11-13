import GitIssueCard from "../main-section/issue-cards/card/GitIssueCard";
import { SelectiveIssuesJsonShape } from "../useIssues/useIssuesTypes";

export default function TasksPrioritySection({
  priorityList,
  issues,
  setIssues,
  setPriorityList,
  lastUpdated,
}: {
  priorityList: string[];
  issues: SelectiveIssuesJsonShape;
  setIssues: (type?: string, body?: { [key: string]: string }) => void;
  setPriorityList: (valueIn: string | string[]) => void;
  lastUpdated: string;
}): React.ReactNode {
  if (priorityList.length === 0) return null;
  return (
    <div className="border-2 border-solid border-neutral-500 dark:border-neutral-400 rounded box-border p-2 my-[1em] mb-[3em]">
      <h2 className="normal-case text-left m-0 mb-2 mx-auto w-fit">
        {"Priority"}
        <span className="font-light text-neutral-500 dark:text-neutral-400 text-sm">
          {` (${priorityList.length})`}
        </span>
      </h2>
      <div className="grid gap-0 rounded border border-solid border-neutral-400 dark:border-neutral-500 p-0 overflow-clip">
        {priorityList.map((numberString, index) => {
          const currentIssue = issues.find(
            (entry) => `${entry.number}` === numberString,
          );
          if (currentIssue) {
            return (
              <div
                key={`${index}${numberString}`}
                className="px-1 grid grid-cols-[auto_1fr]"
              >
                <button
                  className="block leading-[2.2] p-1 m-0 bg-transparent text-sm border-none min-w-[2.2em]"
                  onClick={() => {
                    const currentIssueNumberString = `${currentIssue.number}`;
                    const newArray = priorityList.filter(
                      (numberString) =>
                        numberString !== currentIssueNumberString,
                    );
                    newArray.unshift(currentIssueNumberString);
                    setPriorityList(newArray);
                  }}
                >
                  {index + 1}
                </button>
                <GitIssueCard
                  issue={currentIssue}
                  setIssues={setIssues}
                  priorityList={priorityList}
                  setPriorityList={setPriorityList}
                  lastUpdated={lastUpdated}
                />
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}
