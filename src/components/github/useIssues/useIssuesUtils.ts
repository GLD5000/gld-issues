import {
  adjustDateToWorkday,
  // dateIsThisWeek,
  getCurrentCentury,
  getCurrentWeekNumber,
  getWeekNumberFromISOString,
} from "@/utils/dates";
import {
  SelectiveIssue,
  SelectiveIssuesJsonShape,
  IssuesJsonShape,
  Issue,
  SelectiveIssueLabel,
  SelectiveIssueBody,
  IssuesSessionObject,
} from "./useIssuesTypes";
import { gldIssuesConfig } from "../../../../gitIssues.config";

export function getIssueDeadlineSortValue(issueIn: SelectiveIssue) {
  const deadline = getIssueDeadline(issueIn) || "";
  return deadline
    .split(/[\s\.\-\/\\]/)
    .toReversed()
    .join("");
}
export function getIssueUpdatedSortValue(issueIn: SelectiveIssue) {
  const updated = issueIn.updated_at || "";
  const sortNumber = updated.replace(/[\:TZ\/\.\s\.\-\/\\\-]/g, "");
  return sortNumber;
}
export function getIssueDeadline(issueIn: SelectiveIssue) {
  return getStringDeadlineDate(issueIn.title);
}
const issueDeadlineRegex = /\d\d[\s\.\-\/\\]+\d\d[\s\.\-\/\\]+\d\d$/;
export function getStringDeadlineDate(stringIn: string) {
  const matchReturn = stringIn.trim().match(issueDeadlineRegex);
  const deadline = matchReturn ? matchReturn[0] : undefined;
  return deadline || undefined;
}
export function getTitleNoDeadline(issueIn: SelectiveIssue) {
  return issueIn.title.trim().replace(issueDeadlineRegex, "").trim();
}
export function reBuildIssueTitle(
  shortTitle: string,
  deadline: string | undefined,
) {
  const deadlineString = deadline ? getStringDeadlineDate(deadline) : undefined;
  return deadlineString ? `${shortTitle} ${deadlineString}` : shortTitle;
}

export function getDeadlineDate(deadline: string | undefined) {
  if (deadline === undefined) return undefined;
  const century = getCurrentCentury();
  const [day, month, year] = deadline.split("/").map((value) => Number(value));
  return new Date(year + century, month - 1, day, 1);
}

export function getIssueDeadlineDateObject(issueIn: SelectiveIssue) {
  return getDeadlineDate(getIssueDeadline(issueIn)) || null;
}

export function getIssueDeadlineDateComboString(issueIn: SelectiveIssue) {
  const deadline = getIssueDeadline(issueIn);
  if (!deadline) return undefined;
  const deadlineDate = getDeadlineDate(deadline);
  if (!deadlineDate || !(deadlineDate instanceof Date)) return undefined;
  try {
    return convertDateToDayDateComboString(deadlineDate);
  } catch (error) {
    console.log("deadlineDate:", deadlineDate);
    console.error("error:", error);
  }
}
function convertDateToDayDateComboString(dateIn: Date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const date = dateIn.getDate();
  const day = days[dateIn.getDay()];
  const month = `${dateIn.getUTCMonth() + 1}`.padStart(2, "0");
  const year = `${dateIn.getFullYear()}`.slice(2);
  return `${day} ${date}/${month}/${year}`;
}
export function getAdjustedDeadlineDate(issue: SelectiveIssue) {
  const deadline = getIssueDeadline(issue) || undefined;
  if (!deadline) return null;
  return adjustDateToWorkday(getDeadlineDate(deadline) || new Date());
}
function makeTimeObject(issues: SelectiveIssuesJsonShape, currentWeek: number) {
  const returnObject: { [key: string]: SelectiveIssuesJsonShape } = {
    "This Week": [],
    "Next Week": [],
    [`Week ${currentWeek + 2}`]: [],
    [`Week ${currentWeek + 3}`]: [],
    Later: [],
    Earlier: [],
  };

  const filteredIssues = filterToDoIssues(issues);
  filteredIssues.forEach((issue) => {
    const deadline = getIssueDeadline(issue) || undefined;
    if (deadline) {
      const deadlineDate = getAdjustedDeadlineDate(issue);
      try {
        const issueWeekNumber = deadlineDate
          ? getWeekNumberFromISOString(deadlineDate.toISOString())
          : undefined;
        if (issueWeekNumber === undefined) {
        } else if (
          issueWeekNumber !== undefined &&
          currentWeek === issueWeekNumber
        ) {
          addTodoObject("This Week", issue, returnObject);
        } else if (currentWeek + 1 === issueWeekNumber) {
          addTodoObject("Next Week", issue, returnObject);
        } else if (currentWeek + 2 === issueWeekNumber) {
          addTodoObject(`Week ${currentWeek + 2}`, issue, returnObject);
        } else if (currentWeek + 3 === issueWeekNumber) {
          addTodoObject(`Week ${currentWeek + 3}`, issue, returnObject);
        } else if (
          issue.state === "open" &&
          issueWeekNumber > currentWeek + 3
        ) {
          addTodoObject(`Later`, issue, returnObject);
        } else if (issue.state === "open" && issueWeekNumber < currentWeek) {
          addTodoObject(`Earlier`, issue, returnObject);
        }
      } catch (e) {
        console.log("issue.title:", issue.title);
        console.log("deadline:", deadline);

        console.log("deadlineDate:", deadlineDate);
        console.log("e:", e);
      }
    }
  });
  return returnObject;
}

export function makeWeeklyToDoObject(issuesObject: IssuesSessionObject) {
  const { issues, labels } = issuesObject;
  const currentWeek = getCurrentWeekNumber();

  const categoriesObject: { [key: string]: SelectiveIssuesJsonShape } = {
    // 'This Week': [],
    // 'Next Week': [],
    // Blocked: [],
  };
  let timeObject: { [key: string]: SelectiveIssuesJsonShape } = {
    // 'This Week': [],
    // 'Next Week': [],
    // Blocked: [],
  };
  const categories = labels
    ?.map((label) => label.name)
    .filter(
      (label) => !gldIssuesConfig.githubIssueCategoriesExclude.includes(label),
    ) as string[];
  console.log("categories:", categories);
  if (issues) {
    timeObject = makeTimeObject(issues, currentWeek);

    categories.forEach((key) => {
      categoriesObject[key] = [];
    });
    const filteredIssues = filterToDoIssues(issues);
    filteredIssues.forEach((issue) => {
      if (
        !categories.some((label) => {
          if (issue.labels?.some((item) => item.name === label)) {
            addTodoObject(label, issue, categoriesObject);
            return true;
          }
        })
      ) {
        addTodoObject("Uncategorised", issue, categoriesObject);
      }
    });
  }

  return { categoriesObject, timeObject };
}

// function completedAsPlanned(issue: SelectiveIssue) {
//   return issue.state !== "open" && issue.state_reason !== "not_planned";
// }
function filterToDoIssues(arrayIn: SelectiveIssuesJsonShape) {
  return arrayIn.toReversed();
  // .filter(
  // (issue) =>
  // !issueIsTodo(issue) &&
  // (issue.state === "open" ||
  //   (completedAsPlanned(issue) && dateIsThisWeek(issue.created_at)) ||
  //   (completedAsPlanned(issue) &&
  //     issue.closed_at &&
  //     dateIsThisWeek(issue.closed_at))),
  // );
}
export function issueIsBlocked(issue: SelectiveIssue) {
  return (
    issue.state === "open" &&
    issue.labels.some((label) => label.name === "awaiting")
  );
}
export function issueIsTesting(issue: SelectiveIssue) {
  return (
    issue.state === "open" &&
    issue.labels.some((label) => label.name === "testing")
  );
}
export function issueIsParent(issue: SelectiveIssue) {
  return issue.labels.some((label) => label.name === "parent project");
}
export function issueIsTodo(issue: SelectiveIssue) {
  return issue.labels.some((label) => label.name === "todo");
}
export function convertIssuesToSelectiveIssues(issues: IssuesJsonShape) {
  return issues.map(convertIssueToSelectiveIssue) as SelectiveIssuesJsonShape;
}
function convertIssueToSelectiveIssue(issue: Issue): SelectiveIssue {
  const {
    number,
    title,
    labels,
    state,
    assignee,
    milestone,
    comments,
    created_at,
    updated_at,
    closed_at,
    body,
    state_reason,
  } = issue;
  const convertedIssue = {
    number,
    labels: labels.map((labelEntry): SelectiveIssueLabel => {
      const { name, color, description } = labelEntry;
      return { name, color, description };
    }),
    assignee: assignee ? assignee.login : "",
    title,
    state,
    milestone,
    comments,
    created_at,
    updated_at,
    closed_at,
    body: body, //getLinksTasksFromBodyString(body),
    state_reason,
  };
  return convertedIssue;
}
export function getLinksTasksFromBodyString(body: string): SelectiveIssueBody {
  console.log("body:", body);
  const webLinkRegex = /https:[^\n\r\)]+/g;

  const tasksRegex = /- \[[x ]{1}\][^\r\n]+/g;
  const tasksArray = body?.match(tasksRegex);
  const taskLists: string[] = [];
  if (tasksArray && Array.isArray(tasksArray)) {
    tasksArray.forEach((task) => taskLists.push(task));
  }

  const webLinks = body?.match(webLinkRegex);
  const links: string[] = [];
  if (webLinks && Array.isArray(webLinks)) {
    webLinks.forEach((link) => links.push(link));
  }
  return { links, taskLists };
}
function addTodoObject(
  key: string,
  issue: SelectiveIssue,
  toDoObject: { [key: string]: SelectiveIssuesJsonShape },
) {
  if (toDoObject[key]) {
    toDoObject[key].push(issue);
  } else {
    toDoObject[key] = [issue];
  }
}
