import {
  adjustDateToPreviousWorkday,
  adjustDateToWorkday,
  dateIsLastFortnight,
  dateIsThisWeek,
  getCurrentCentury,
  getWeekNumberFromISOString,
} from "@/utils/dates";
import { useStore } from "@/zustand/zustand";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type Issue = {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: false;
  };
  labels: [
    {
      id: number;
      node_id: string;
      url: string;
      name: string;
      color: string;
      default: false;
      description: string;
    },
    {
      id: number;
      node_id: string;
      url: string;
      name: string;
      color: string;
      default: false;
      description: string;
    },
  ];
  state: string;
  locked: false;
  assignee: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: false;
  };
  assignees: [
    {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      user_view_type: string;
      site_admin: false;
    },
  ];
  milestone: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string;
  author_association: string;
  active_lock_reason: string;
  body: string;
  closed_by: string;
  reactions: {
    url: string;
    total_count: number;
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: 0;
  };
  timeline_url: string;
  performed_via_github_app: string;
  state_reason: string;
};
// Define the type for an array of issues

type SelectiveIssueLabel = {
  // id: number;
  // node_id: string;
  // url: string;
  name: string;
  color: string;
  // default: false;
  description: string;
};
type SelectiveIssueBody = {
  links: string[];
  taskLists: string[];
};

export type SelectiveIssue = {
  // url: string;
  // repository_url: string;
  // labels_url: string;
  // comments_url: string;
  // events_url: string;
  // html_url: string;
  // id: number;
  // node_id: string;
  number: number;
  title: string;
  // user: {
  //     login: string;
  //     id: number;
  //     node_id: string;
  //     avatar_url: string;
  //     gravatar_id: string;
  //     url: string;
  //     html_url: string;
  //     followers_url: string;
  //     following_url: string;
  //     gists_url: string;
  //     starred_url: string;
  //     subscriptions_url: string;
  //     organizations_url: string;
  //     repos_url: string;
  //     events_url: string;
  //     received_events_url: string;
  //     type: string;
  //     user_view_type: string;
  //     site_admin: false;
  // };
  labels: SelectiveIssueLabel[];
  state: string;
  // locked: false;
  assignee: string; //login: string;
  // {
  // login: string;
  // id: number;
  // node_id: string;
  // avatar_url: string;
  // gravatar_id: string;
  // url: string;
  // html_url: string;
  // followers_url: string;
  // following_url: string;
  // gists_url: string;
  // starred_url: string;
  // subscriptions_url: string;
  // organizations_url: string;
  // repos_url: string;
  // events_url: string;
  // received_events_url: string;
  // type: string;
  // user_view_type: string;
  // site_admin: false;
  // };
  // assignees: [
  //     {
  //         login: string;
  //         id: number;
  //         node_id: string;
  //         avatar_url: string;
  //         gravatar_id: string;
  //         url: string;
  //         html_url: string;
  //         followers_url: string;
  //         following_url: string;
  //         gists_url: string;
  //         starred_url: string;
  //         subscriptions_url: string;
  //         organizations_url: string;
  //         repos_url: string;
  //         events_url: string;
  //         received_events_url: string;
  //         type: string;
  //         user_view_type: string;
  //         site_admin: false;
  //     },
  // ];
  milestone: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string;
  // author_association: string;
  // active_lock_reason: string;
  body: SelectiveIssueBody; //Strip out task list and links
  // closed_by: string;
  // reactions: {
  //     url: string;
  //     total_count: number;
  //     '+1': number;
  //     '-1': number;
  //     laugh: number;
  //     hooray: number;
  //     confused: number;
  //     heart: number;
  //     rocket: number;
  //     eyes: 0;
  // };
  // timeline_url: string;
  // performed_via_github_app: string;
  state_reason: string;
};

export type IssuesJsonShape = Issue[];
export type SelectiveIssuesJsonShape = SelectiveIssue[];

export type IssuesSessionObject = {
  metadata: { lastUpdated: string };
  issues: SelectiveIssuesJsonShape | null;
};

const keyName = "gitHubIssues";
function getSessionStorageIssues() {
  return window.sessionStorage.getItem(keyName);
}
function setSessionStorageIssues(newObject: IssuesSessionObject) {
  return window.sessionStorage.setItem(keyName, JSON.stringify(newObject));
}
function addFetchedIssuesToSessionStorageObject(
  newObject: SelectiveIssuesJsonShape,
) {
  const sessionStorageIssues = getSessionStorageIssues();
  if (!sessionStorageIssues) return newObject;
  const sessionStorageIssuesObject = JSON.parse(
    sessionStorageIssues,
  ) as IssuesSessionObject;
  const oldIssuesArray = sessionStorageIssuesObject.issues || [];
  newObject.forEach((issueObject) => {
    const insertIndex = oldIssuesArray?.findIndex(
      (arrayItem) => arrayItem.number === issueObject.number,
    );
    if (insertIndex > -1) {
      oldIssuesArray[insertIndex] = issueObject;
    } else {
      oldIssuesArray.unshift(issueObject);
    }
  });
  return oldIssuesArray;
}
export const issueTargetLabels = [
  // 'priority',
  // 'awaiting',
  "Targets",
  "Website - GTM",
  "Website - content",
  "Website - loyalty",
  "Website - CLP",
  "Website - PDP",
  "Website - Core Web Vitals",
  "Website - UX",
  "Website - SEO",
  "Website - Accessibility",
  "Website - AB Testing",
  "Website - security",
  "SFCC - fix",
  "SFCC - workflow",
  "Dev 2.0 - fix",
  "Dev 2.0 - testing / QA",
  "Dev 2.0 - build tools",
  "Dev 2.0 - collaboration",
  "Dev 2.0 - project management",
  "Dev 2.0 - reporting",
  "Dev 2.0 - helpdesk",
];

export function useIssues(): [
  IssuesSessionObject | null,
  (
    type?: string, //eslint-disable-line
    body?: //eslint-disable-line
    {
      [key: string]: string;
    },
  ) => {},
] {
  const [state, setState] = useState<IssuesSessionObject | null>(null);
  const { accessLevel } = useStore((state) => state);
  useEffect(() => {
    async function initializeState() {
      try {
        const sessionStorageReturn = getSessionStorageIssues();
        const value = sessionStorageReturn
          ? JSON.parse(`${sessionStorageReturn}`)
          : undefined;
        if (value) {
          const object = value.metadata
            ? value
            : {
                issues: [...value],
                metadata: {
                  lastUpdated: undefined,
                },
              };
          setState(object as IssuesSessionObject);
        } else {
          storeNewValue(setState);
        }
      } catch (err) {
        console.error("Error initializing state:", err);
        setState(null);
      }
    }

    initializeState();
  }, [setState]);

  async function refreshValue(type = "refresh", body?: Record<string, string>) {
    if (type === "close" || (type === "patchTodo" && body)) {
      const slug =
        body && body.issue_number ? `${body.issue_number}` : undefined;
      try {
        const request = {
          method: "PATCH",
          body: JSON.stringify(body),
        };
        const response = await fetch(`/api/makeGithubIssues/${type}`, request);
        if (!response.ok) {
          throw new Error("Failed to fetch log file");
        }
        const returnValue = await response.json();
        await storeNewValue(setState, slug);
        return returnValue;
      } catch (error) {
        console.error("Error fetching log file:", error);
        return null;
      }
    } else if (type === "new" && body) {
      try {
        const request = {
          method: "POST",
          body: JSON.stringify(body),
        };
        const response = await fetch(`/api/makeGithubIssues/${type}`, request);
        if (!response.ok) {
          throw new Error("Failed to fetch log file");
        }
        const returnValue = await response.json();
        await storeNewValue(setState, returnValue.issue.number);
        return returnValue;
      } catch (error) {
        console.error("Error fetching log file:", error);
        return null;
      }
    } else {
      storeNewValue(setState);
    }
  }
  return accessLevel === "dev"
    ? [state, refreshValue]
    : [
        state,
        (
          type = "refresh",
          body?: Record<string, string>, // eslint-disable-line
        ) => {
          console.log("accessLevel:", accessLevel);
          console.log(type);
          console.log("body:", JSON.stringify(body));
          return refreshValue();
        },
      ];
}
async function storeNewValue(
  setState: Dispatch<SetStateAction<IssuesSessionObject | null>>,
  slug?: string,
) {
  const fetchedValue = await fetchGithubTasks(slug);
  if (!fetchedValue) return;
  const selectiveValue = slug
    ? addFetchedIssuesToSessionStorageObject(
        convertIssuesToSelectiveIssues(fetchedValue),
      )
    : convertIssuesToSelectiveIssues(fetchedValue);
  const newObject: IssuesSessionObject = {
    metadata: {
      lastUpdated: new Date().toISOString(),
    },
    issues: selectiveValue,
  };
  setState(newObject);
  setSessionStorageIssues(newObject);
}
async function fetchGithubTasks(slug?: string) {
  console.log("Fetch running...");
  try {
    const response = await fetch(
      slug ? `/api/getGithubIssues/${slug}` : "/api/getGithubIssues/tasks/",
    );
    if (!response.ok) {
      throw new Error("Failed to fetch log file");
    }
    const { issues } = await response.json();
    return issues as IssuesJsonShape;
  } catch (error) {
    console.error("Error fetching log file:", error);
    return null;
  }
}

function addTodoObject(
  key: string,
  issue: SelectiveIssue,
  toDoObject: { [key: string]: SelectiveIssuesJsonShape },
) {
  toDoObject[key] ? toDoObject[key].push(issue) : (toDoObject[key] = [issue]);
}
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

export function makeWeeklyToDoObject(
  issues: SelectiveIssuesJsonShape,
  currentWeek: number,
) {
  const categoriesObject: { [key: string]: SelectiveIssuesJsonShape } = {
    // 'This Week': [],
    // 'Next Week': [],
    // Blocked: [],
  };
  const timeObject = makeTimeObject(issues, currentWeek);
  issueTargetLabels.forEach((key) => {
    categoriesObject[key] = [];
  });
  const filteredIssues = filterToDoIssues(issues);
  filteredIssues.forEach((issue) => {
    if (
      !issueTargetLabels.some((label) => {
        if (issue.labels?.some((item) => item.name === label)) {
          addTodoObject(label, issue, categoriesObject);
          return true;
        }
      })
    ) {
      // addTodoObject('other', issue, categoriesObject);
    }
  });

  return { categoriesObject, timeObject };
}
function makeTimeObject(issues: SelectiveIssuesJsonShape, currentWeek: number) {
  const returnObject: { [key: string]: SelectiveIssuesJsonShape } = {
    "This Week": [],
    "Next Week": [],
    [`Week ${currentWeek + 2}`]: [],
    [`Week ${currentWeek + 3}`]: [],
    Later: [],
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
        if (currentWeek === issueWeekNumber) {
          addTodoObject("This Week", issue, returnObject);
        } else if (currentWeek + 1 === issueWeekNumber) {
          addTodoObject("Next Week", issue, returnObject);
        } else if (currentWeek + 2 === issueWeekNumber) {
          addTodoObject(`Week ${currentWeek + 2}`, issue, returnObject);
        } else if (currentWeek + 3 === issueWeekNumber) {
          addTodoObject(`Week ${currentWeek + 3}`, issue, returnObject);
        } else if (issue.state === "open") {
          addTodoObject(`Later`, issue, returnObject);
        }
      } catch (e) {
        console.log("issue.title:", issue.title);
        console.log("deadline:", deadline);

        console.log("deadlineDate:", deadlineDate);
        console.log("e:", e);
      }
    }
    // }   else {
    //     addTodoObject('Other', issue, returnObject);
    // }
    // if (
    //     issue.state === 'open' &&
    //     issue.labels.some((label) => label.name === 'awaiting')
    // ) {
    //     addTodoObject('Blocked', issue, returnObject);
    // }

    // if (
    //     !issueTargetLabels.some((label) => {
    //         if (issue.labels?.some((item) => item.name === label)) {
    //             addTodoObject(label, issue, returnObject);
    //             return true;
    //         }
    //     })
    // ) {
    //     addTodoObject('other', issue, returnObject);
    // }
  });
  return returnObject;
}
export function getAdjustedDeadlineDate(issue: SelectiveIssue) {
  const deadline = getIssueDeadline(issue) || undefined;
  if (!deadline) return null;
  return issueIsGTM(issue)
    ? adjustDateToPreviousWorkday(getDeadlineDate(deadline) || new Date())
    : adjustDateToWorkday(getDeadlineDate(deadline) || new Date());
}

function completedAsPlanned(issue: SelectiveIssue) {
  return issue.state !== "open" && issue.state_reason !== "not_planned";
}
function filterToDoIssues(
  arrayIn: SelectiveIssuesJsonShape,
  includeLastWeekGTM = true,
) {
  return arrayIn
    .toReversed()
    .filter(
      (issue) =>
        !issueIsTodo(issue) &&
        (issue.state === "open" ||
          (completedAsPlanned(issue) && dateIsThisWeek(issue.created_at)) ||
          (completedAsPlanned(issue) &&
            issue.closed_at &&
            dateIsThisWeek(issue.closed_at)) ||
          (includeLastWeekGTM &&
            issueIsGTM(issue) &&
            issue.closed_at &&
            completedAsPlanned(issue) &&
            dateIsLastFortnight(issue.closed_at))),
    );
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
export function issueIsGTM(issue: SelectiveIssue) {
  return issue.labels.some((label) => label.name === "Website - GTM");
}
export function issueIsParent(issue: SelectiveIssue) {
  return issue.labels.some((label) => label.name === "parent project");
}
export function issueIsTodo(issue: SelectiveIssue) {
  return issue.labels.some((label) => label.name === "todo");
}
function convertIssuesToSelectiveIssues(issues: IssuesJsonShape) {
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
    body: getLinksTasksFromBodyString(body),
    state_reason,
  };
  return convertedIssue;
}
function getLinksTasksFromBodyString(body: string): SelectiveIssueBody {
  const webLinkRegex = /https:[^\n\r]+/g;

  const tasksRegex = /- \[[x ]{1}\][^\r\n]+/g;
  const tasksArray = body?.match(tasksRegex);
  let taskLists: string[] = [];
  if (tasksArray && Array.isArray(tasksArray)) {
    tasksArray.forEach((task) => taskLists.push(task));
  }

  const webLinks = body?.match(webLinkRegex);
  let links: string[] = [];
  if (webLinks && Array.isArray(webLinks)) {
    webLinks.forEach((link) => links.push(link));
  }
  return { links, taskLists };
}
