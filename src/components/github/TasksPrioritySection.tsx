import GitIssueCard from "./GitIssueCard";
import { SelectiveIssuesJsonShape } from "./useIssues/useIssuesTypes";

export default function TasksPrioritySection({
  listIssueArray,
  issues,
  setIssues,
  setListIssue,
  lastUpdated,
}: {
  listIssueArray: string[];
  issues: SelectiveIssuesJsonShape;
  setIssues: (type?: string, body?: { [key: string]: string }) => {}; //eslint-disable-line
  setListIssue: (valueIn: string | string[]) => void; //eslint-disable-line
  lastUpdated: string;
}): React.ReactNode {
  if (listIssueArray.length === 0) return null;
  return (
    <div className="border-2 border-solid border-neutral-500 dark:border-neutral-400 rounded box-border p-2 my-[1em] mb-[3em]">
      <h2 className="normal-case text-left m-0 mb-2 mx-auto w-fit">
        {"Priority"}
        <span className="font-light text-neutral-500 dark:text-neutral-400 text-sm">
          {` (${listIssueArray.length})`}
        </span>
      </h2>
      <div className="grid gap-0 rounded border border-solid border-neutral-400 dark:border-neutral-500 p-0 overflow-clip">
        {listIssueArray.map((numberString, index) => {
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
                    const newArray = listIssueArray.filter(
                      (numberString) =>
                        numberString !== currentIssueNumberString,
                    );
                    newArray.unshift(currentIssueNumberString);
                    setListIssue(newArray);
                  }}
                >
                  {index + 1}
                </button>
                <GitIssueCard
                  issue={currentIssue}
                  setIssues={setIssues}
                  listIssueArray={listIssueArray}
                  setListIssue={setListIssue}
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
