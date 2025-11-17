import { ComponentProps, useState } from "react";
import { convertIsoDateToDayDateComboString } from "@/utils/dates";
import DoubleClickInput from "./DoubleClickInput";
import TickSvg from "@/icons/TickSvg";
import UnTicked from "@/icons/UnTicked";
import GitIssueDeadlineButton from "./GitIssueDeadlineButton";
import GitIssueBodyTodoList from "./GitIssueBodyTodoList";
import { classMerge } from "@/utils/twUtils";
import {
  getIssueDeadline,
  getTitleNoDeadline,
  getIssueDeadlineDateComboString,
  reBuildIssueTitle,
  getStringDeadlineDate,
} from "../../../useIssues/useIssuesUtils";
import { SelectiveIssue } from "../../../useIssues/useIssuesTypes";
import CategoryAddIssueButton from "../../categories/CategoryAddIssueButton";
import GitIssueStateButton from "./GitIssueStateButton";
import TickSvgV2 from "@/icons/TickSvgV2";

interface GitIssueCardProps extends ComponentProps<"details"> {
  issue: SelectiveIssue;
  setIssues: (
    type?: string,
    body?: {
      [key: string]: string;
    },
  ) => void;
  priorityList: string[];

  setPriorityList: (valueIn: string | string[]) => void;
  lastUpdated: string;
}

export default function GitIssueCard({
  issue,
  setIssues,
  priorityList,
  setPriorityList,
  lastUpdated,
  className,
  ...props
}: GitIssueCardProps) {
  const [deadline, setDeadline] = useState(getIssueDeadline(issue));
  const [shortTitle, setShortTitle] = useState(getTitleNoDeadline(issue));
  const [previousUpdate, setPreviousUpdate] = useState("");
  const [fullTitle, setFullTitle] = useState(issue.title);
  const lastUpdate = issue.updated_at
    ? convertIsoDateToDayDateComboString(issue.updated_at)
    : undefined;
  const closedAt = issue.closed_at
    ? convertIsoDateToDayDateComboString(issue.closed_at)
    : undefined;

  const created = issue.created_at
    ? convertIsoDateToDayDateComboString(issue.created_at)
    : undefined;
  const titleIsLoading = previousUpdate === `title-${lastUpdated}`;
  const labels = issue.labels.map((label) => (
    <div
      key={label.name}
      className="rounded-full border border-solid w-fit h-fit py-0 px-2 font-normal text-sm"
      style={{ borderColor: `#${label.color}` }}
    >
      {label.name}
    </div>
  ));
  if (!issue) return null;

  const mondayLinks = issue.body?.links?.filter(
    (link) => link.toLowerCase().indexOf("monday") > -1,
  );
  const jiraLinks = issue.body?.links?.filter(
    (link) => link.toLowerCase().indexOf("jira") > -1,
  );
  const sharepointLinks = issue.body?.links?.filter(
    (link) => link.toLowerCase().indexOf("sharepoint") > -1,
  );
  const otherLinks = issue.body?.links?.filter(
    (link) =>
      link.indexOf("monday") === -1 &&
      link.indexOf("jira") === -1 &&
      link.indexOf("sharepoint") === -1,
  );
  const taskList = issue.body?.taskLists || undefined;
  const summaryId = `${shortTitle}`; // Make unique with ${issue.number} -
  return (
    <div className="relative w-full">
      <div className="mr-6 md:mr-0 flex flex-wrap lg:grid lg:grid-cols-[auto_1fr_auto_auto] gap-1 items-center w-[calc(100%-26px)] lg:w-full box-border bg-neutral-100 dark:bg-neutral-800">
        <div className="w-fit h-full p-1">
          {" "}
          <button
            className="m-0.5 hidden md:block  text-center text-sm border border-current border-solid w-4.5 h-4.5  rounded-md bg-transparent text-neutral-500 dark:text-neutral-400 hover:text-black focus:text-black hover:dark:text-white focus:dark:text-white transition box-border"
            type="button"
            onClick={() => {
              const issueNumberString = `${issue.number}`;
              setPriorityList(issueNumberString);
            }}
          >
            {priorityList.includes(`${issue.number}`) && <TickSvgV2 />}
          </button>
        </div>
        <DoubleClickInput
          onBlurHandler={shortTitleOnBlurHandler}
          onChangeHandler={shortTitleOnChangeHandler}
          onClickHandler={shortTitleOnClickHandler}
          inputValue={shortTitle}
          displayValue={getTitleNoDeadline(issue)}
          isLoading={titleIsLoading}
          width="w-[calc(92vw-24px)] md:w-[calc(87vw-442px)] xl:w-full box-border"
          textAlign="p-[2px] md:p-0 text-center md:text-left text-sm"
        />
        <div className="mx-auto md:ml-auto gap-2 grid md:grid-cols-3 w-36 md:w-108 items-center ">
          <DoubleClickInput
            onBlurHandler={deadlineOnBlurHandler}
            onChangeHandler={deadlineOnChangeHandler}
            onClickHandler={deadlineOnClickHandler}
            inputValue={deadline || ""}
            displayValue={getIssueDeadlineDateComboString(issue)}
            placeHolder="dd/mm/yy"
            width="w-[8em] mx-auto"
            textAlign="text-center text-sm"
            isLoading={titleIsLoading}
          />
          <div className="hidden md:block">
            {" "}
            <GitIssueDeadlineButton issue={issue} />
          </div>

          <GitIssueStateButton
            issue={issue}
            setIssues={setIssues}
            lastUpdated={lastUpdated}
          />
        </div>
        <div className="w-6"></div>
      </div>
      <details
        className={classMerge(
          `text-sm w-full box-border rounded-none group bg-white dark:bg-black`,
          className,
        )}
        {...props}
      >
        <summary
          aria-label={`${summaryId}`}
          className="cursor-pointer p-1 absolute top-0 right-0 bottom-0 flex flex-wrap gap-1 items-center w-7 box-border bg-white dark:bg-black group focus-within:outline-0"
        >
          <span className="text-center ease-out duration-200 group-open:rotate-180 group-open:ease-in rounded-[50%] w-full aspect-square box-border block text-neutral-500 dark:text-neutral-400 group-hover:text-black group-focus-within:text-black group-hover:dark:text-white group-focus-within:dark:text-white group-hover:border-current group-focus-within:border-current border-transparent border border-solid pointer-events-none transition">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 16 16"
              className="rotate-90 w-full h-auto"
            >
              <path
                className="stroke-current"
                style={{
                  fill: "none",
                  strokeWidth: "1.5",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeDasharray: "none",
                  strokeOpacity: 1,
                }}
                d="m 7,5 4,3 -4,3"
              />
            </svg>
          </span>
        </summary>
        <div className="grid gap-4 text-sm w-full box-border p-4 newDesktop:p-8">
          <div className="flex flex-wrap items-center">
            <DoubleClickInput
              onBlurHandler={fullTitleOnBlurHandler}
              onChangeHandler={fullTitleOnChangeHandler}
              onClickHandler={fullTitleOnClickHandler}
              inputValue={fullTitle || ""}
              displayValue={issue.title}
              width="w-[20em] sm:w-[30em] md:w-[40em] lg:w-[50em] newDesktop:w-[60em]"
              isLoading={titleIsLoading}
            />
            <CategoryAddIssueButton
              label={issue.labels.map((label) => label.name).join(",")}
              setIssues={setIssues}
              title={issue.title}
            />
          </div>
          <GitIssueBodyTodoList
            issueNumber={issue.number}
            setIssues={setIssues}
            taskList={taskList}
          />
          <a
            className="block text-inherit transition hover:underline focus:underline w-fit"
            href={`${process.env.NEXT_PUBLIC_GH_URL}issues/${issue.number}`}
            target="_blank"
          >
            Github.com Issue #{issue.number} &rarr;
          </a>
          {mondayLinks &&
            mondayLinks.map((link, index) => (
              <a
                className="block text-inherit transition hover:underline focus:underline w-fit"
                href={link}
                target="_blank"
                key={`link-${index}`}
              >
                Monday.com {link.slice(link.lastIndexOf("/") + 1)} &rarr;
              </a>
            ))}
          {jiraLinks &&
            jiraLinks.map((link, index) => (
              <a
                className="block text-inherit transition hover:underline focus:underline w-fit"
                href={link}
                target="_blank"
                key={`link-${index}`}
              >
                JIRA {link.slice(link.lastIndexOf("/") + 1)} &rarr;
              </a>
            ))}
          {sharepointLinks &&
            sharepointLinks.map((link, index) => (
              <a
                className="block text-inherit transition hover:underline focus:underline w-fit"
                href={link}
                target="_blank"
                key={`link-${index}`}
              >
                SharePoint {link.slice(link.lastIndexOf("/") + 1)} &rarr;
              </a>
            ))}
          {otherLinks &&
            otherLinks.map((link, index) => (
              <a
                className="block text-inherit transition hover:underline focus:underline w-fit"
                href={link}
                target="_blank"
                key={`link-${index}`}
              >
                {
                  link
                    .replace("https", "")
                    .replace("http", "")
                    .replace("://", "")
                    .split("/")[0]
                }{" "}
                &rarr;
              </a>
            ))}
          <a
            className="block text-inherit transition hover:underline focus:underline w-fit"
            href={`${process.env.NEXT_PUBLIC_GH_URL}issues/${issue.number}`}
            target="_blank"
          >
            {"Comments: " + issue.comments}
          </a>
          <div className="flex flex-wrap justify-center gap-2 w-fit">
            {labels}
          </div>
          <div className="flex gap-4 font-light text-neutral-500 dark:text-neutral-400 text-sm">
            <span>{`Created: ${created}`}</span>
            <span>{`Updated: ${lastUpdate}`}</span>
            {issue.state !== "open" && <span>{`Closed: ${closedAt}`}</span>}
          </div>
        </div>
      </details>
    </div>
  );
  function setTitlesToLoad() {
    setPreviousUpdate(`title-${lastUpdated}`);
  }
  function shortTitleOnBlurHandler(e: React.FocusEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value;
    const newTitle = reBuildIssueTitle(newValue, deadline);
    if (newValue && newTitle !== issue.title) {
      setIssues("patchTodo", {
        issue_number: `${issue.number}`,
        title: newTitle,
      });
      setTitlesToLoad();
      setShortTitle(newValue);
    }
  }
  function shortTitleOnChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value;
    setShortTitle(newValue);
  }
  function shortTitleOnClickHandler() {
    setShortTitle(getTitleNoDeadline(issue));
  }
  function deadlineOnBlurHandler(e: React.FocusEvent<HTMLInputElement>) {
    const newValue = getStringDeadlineDate(e.currentTarget.value);
    const newTitle = reBuildIssueTitle(shortTitle, newValue);
    if (newTitle !== issue.title) {
      setIssues("patchTodo", {
        issue_number: `${issue.number}`,
        title: newTitle,
      });
      setTitlesToLoad();
    }
    setDeadline(newValue);
  }
  function deadlineOnChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value;
    setDeadline(newValue);
  }
  function deadlineOnClickHandler() {
    setDeadline(getIssueDeadline(issue));
  }

  function fullTitleOnBlurHandler(e: React.FocusEvent<HTMLInputElement>) {
    const newTitle = e.currentTarget.value.trim();
    if (newTitle && newTitle !== issue.title) {
      setIssues("patchTodo", {
        issue_number: `${issue.number}`,
        title: newTitle,
      });
      setTitlesToLoad();
      setFullTitle(newTitle);
    }
  }
  function fullTitleOnChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value;
    setFullTitle(newValue);
  }
  function fullTitleOnClickHandler() {
    setFullTitle(issue.title);
  }
}
