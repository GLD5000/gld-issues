import { ComponentProps, useState } from "react";
import { convertIsoDateToDayDateComboString } from "@/utils/dates";
import DoubleClickInput from "./DoubleClickInput";
import TickSvg from "@/icons/TickSvg";
import UnTicked from "@/icons/UnTicked";
import GitIssueDeadlineDoubleButton from "./GitIssueDeadlineDoubleButton";
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

interface GitIssueCardProps extends ComponentProps<"details"> {
  issue: SelectiveIssue;
  setIssues: (
    type?: string, //eslint-disable-line
    body?: //eslint-disable-line
    {
      [key: string]: string;
    },
  ) => {};
  priorityList: string[];
  //eslint-disable-next-line
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
  return (
    <details
      className={classMerge(
        `text-sm w-full box-border rounded-none group`,
        className,
      )}
      {...props}
    >
      <summary className="cursor-pointer p-0.5 flex flex-wrap gap-2 items-center w-full box-border bg-neutral-100 dark:bg-neutral-800">
        <span className="text-center text-black dark:text-white right-0 top-1 ease-out duration-200 transition-transform group-open:rotate-180 group-open:ease-in rounded-[50%] w-8 h-8 p-1 box-border block ">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 16 16"
            className="rotate-90 w-full h-auto"
          >
            <path
              className="dark:stroke-neutral-400 stroke-neutral-500"
              id="faq-arrow"
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
        <a
          className="text-neutral-500 dark:text-neutral-400 text-sm w-[4.5em] transition hover:underline focus:underline hover:text-black focus:text-black hover:dark:text-white focus:dark:text-white font-bold"
          href={`https://github.com/GLD5000/Dev-2.0/issues/${issue.number}`}
          target="_blank"
        >
          #{issue.number} &rarr;
        </a>
        <button
          className="text-inherit text-center text-sm border-none w-8 h-8 p-1.5 rounded-lg bg-transparent hover:scale-105 focus:scale-105 transition box-border"
          type="button"
          onClick={() => {
            const issueNumberString = `${issue.number}`;
            setPriorityList(issueNumberString);
          }}
        >
          {priorityList.includes(`${issue.number}`) ? (
            <TickSvg />
          ) : (
            <UnTicked />
          )}
        </button>
        <DoubleClickInput
          onBlurHandler={shortTitleOnBlurHandler}
          onChangeHandler={shortTitleOnChangeHandler}
          onClickHandler={shortTitleOnClickHandler}
          inputValue={shortTitle}
          displayValue={getTitleNoDeadline(issue)}
          isLoading={titleIsLoading}
          width="w-[10em] md:w-[12em] lg:w-[17em] xl:w-[30em]"
        />
        <DoubleClickInput
          onBlurHandler={deadlineOnBlurHandler}
          onChangeHandler={deadlineOnChangeHandler}
          onClickHandler={deadlineOnClickHandler}
          inputValue={deadline || ""}
          displayValue={getIssueDeadlineDateComboString(issue)}
          placeHolder="dd/mm/yy"
          width="w-[8em]"
          textAlign="text-center text-sm"
          isLoading={titleIsLoading}
        />
        <div className="ml-auto gap-2 flex flex-wrap w-fit items-center ">
          <GitIssueDeadlineDoubleButton issue={issue} />

          <GitIssueStateButton
            issue={issue}
            setIssues={setIssues}
            lastUpdated={lastUpdated}
          />
        </div>
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
          href={`https://github.com/GLD5000/Dev-2.0/issues/${issue.number}`}
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
          href={`https://github.com/GLD5000/Dev-2.0/issues/${issue.number}`}
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
