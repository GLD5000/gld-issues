import { getCurrentCentury } from "@/utils/dates";
import { SelectiveIssue } from "./useIssues";

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
