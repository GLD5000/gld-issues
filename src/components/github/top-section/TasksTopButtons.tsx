import { Dispatch, SetStateAction } from "react";
import LoadingSpinner from "../LoadingSpinner";

export default function TasksTopButtons({
  isLoading,
  setPreviousUpdate,
  lastUpdated,
  setIssues,
  date,
  time,
}: {
  isLoading: boolean;
  setPreviousUpdate: React.Dispatch<React.SetStateAction<string>>;
  lastUpdated: string;
  setIssues: (type?: string, body?: { [key: string]: string }) => void;
  date: string;
  time: string;
}) {
  return (
    <div className=" grid gap-2 w-fit h-fit ml-auto">
      <NewIssueButton />
      <UpdateIssuesButton
        isLoading={isLoading}
        setPreviousUpdate={setPreviousUpdate}
        lastUpdated={lastUpdated}
        setIssues={setIssues}
        date={date}
        time={time}
      />
    </div>
  );
}
function UpdateIssuesButton({
  isLoading,
  setPreviousUpdate,
  lastUpdated,
  setIssues,
  date,
  time,
}: {
  isLoading: boolean;
  setPreviousUpdate: Dispatch<SetStateAction<string>>;
  lastUpdated: string;
  setIssues: (type?: string, body?: { [key: string]: string }) => void;
  date: string;
  time: string;
}) {
  return (
    <button
      type="button"
      aria-label="Refresh Issues"
      className="flex flex-wrap gap-0.5 w-fit border-none items-center text-center text-sm p-0 text-neutral-500 dark:text-neutral-400 hover:text-black focus:text-black hover:dark:text-white focus:dark:text-white transition ml-auto box-border"
      onClick={() => {
        if (!isLoading) {
          setPreviousUpdate(lastUpdated);
          setIssues();
        }
      }}
    >
      {lastUpdated && (
        <div className="text-left text-sm ml-auto font-light h-5 block">
          Last updated: {date.split("-").toReversed().join("/")} at{" "}
          {time.split(":")[0]}:{time.split(":")[1]}
        </div>
      )}
      <div className="flex w-6 h-6 rounded-full">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <span className="block m-auto text-base pointer-events-none  ">
            &#10227;
          </span>
        )}
      </div>
    </button>
  );
}

function NewIssueButton() {
  return (
    <a
      target="_blank"
      href={`${process.env.NEXT_PUBLIC_GH_URL}issues/new`}
      className="block text-center text-sm border-black dark:border-white border-2 border-solid py-1 px-2 rounded-lg bg-[#238636] text-white indent-0 transform-none  w-36 h-fit ml-auto box-border hover:scale-105 focus:scale-105 transition"
    >
      <span className="block m-auto p-0 pointer-events-none">New Issue</span>
    </a>
  );
}
