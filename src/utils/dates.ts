export const ONE_WEEK_MS = 604800000;
export const ONE_DAY_MS = 86400000;

export function getDayOfWeek(date: Date): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}
export function getDayOfWeekShort(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}
export function dateIsSatSun(date: Date) {
  const currentDay = date.getDay();

  return currentDay === 6 || currentDay === 0;
}
export function dateIsFri(date: Date) {
  const currentDay = date.getDay();
  return currentDay === 5;
}

export function getDayOfWeekShortIsoString(isoDate: string): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date(isoDate).getDay()];
}
/**
 * Input e.g.: "2024-04-18T19:47:59Z"
 * Output object with:
 * dayNumber
 * dayName
 * monthName
 * monthNumber
 * year
 * hour
 * minute
 * second
 */

export function monthNumberToName(numberAsString: string) {
  const monthLookup: Record<string, string> = {
    "1": "Jan",
    "2": "Feb",
    "3": "Mar",
    "4": "Apr",
    "5": "May",
    "6": "Jun",
    "7": "Jul",
    "8": "Aug",
    "9": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };
  return monthLookup[numberAsString];
}
export function getCurrentCentury(dateIn?: Date) {
  const date = dateIn || new Date();
  const year = date.getFullYear();
  const century = Math.floor(year / 100) * 100;
  return century;
}
export function getYearShort(dateIn?: Date) {
  const date = dateIn || new Date();
  const year = date.getFullYear();
  const century = Math.floor(year / 100) * 100;
  return year - century;
}
export function processGithubDateString(inputString: string) {
  const [date, time] = inputString.replace("Z", "").split("T");
  const [year, monthNumber, dayNumber] = date.split("-");
  const [hour, minute, second] = time.split(":");

  return {
    date,
    time,
    dayNumber,
    dayName: getDayOfWeek(new Date(inputString)),
    monthName: monthNumberToName(monthNumber),
    monthNumber,
    year,
    hour,
    minute,
    second,
  };
}

export function getNewYearsDay(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

export function getPreviousNewYearsDay(date: Date) {
  return new Date(date.getFullYear() - 1, 0, 1);
}

export function timeDiffMs(start: Date, end: Date) {
  return Math.abs(end.valueOf() - start.valueOf());
}
export function timeDiffDays(start: Date, end: Date) {
  return Math.floor(Math.abs(end.valueOf() - start.valueOf()) / ONE_DAY_MS);
}
function weekDayIndexIncrementer(numberIn: number) {
  return numberIn < 6 ? numberIn + 1 : numberIn % 6;
}
function getIsPositive(start: Date, end: Date) {
  return start.valueOf() < end.valueOf();
}
export function timeDiffWorkDays(start: Date, end: Date) {
  const differenceInDays = timeDiffDays(start, end);
  const isPositive = getIsPositive(start, end);
  let dayIndex = isPositive ? start.getDay() : end.getDay();
  let workDays = 0;
  for (let i = 0; i < differenceInDays; i += 1) {
    if (dayIndex > 0 && dayIndex < 6) {
      workDays += 1;
    }
    dayIndex = weekDayIndexIncrementer(dayIndex);
  }

  return isPositive ? workDays : -1 * workDays;
}

export function timeDiffWeeks(start: Date, end: Date) {
  const diffMs = timeDiffMs(start, end);
  return Math.floor(diffMs / ONE_WEEK_MS);
}

export function isBeforeFriday(date: Date) {
  return date.getUTCDay() < 5; // Sunday is first day of week (0)
}

export function getPreviousYearWeekOneStart(date: Date) {
  const newYearsDate = getPreviousNewYearsDay(date);
  const inWeekOne = isBeforeFriday(newYearsDate);
  const newYearsMs = newYearsDate.valueOf();
  const newYearsDay = newYearsDate.getUTCDay(); // 0-6 Sun-Sat
  const weekOneStartMs = inWeekOne
    ? newYearsMs - newYearsDay * ONE_DAY_MS
    : newYearsMs + (7 - newYearsDay) * ONE_DAY_MS;
  return new Date(weekOneStartMs);
}

export function getWeekOneStart(date: Date) {
  const newYearsDate = getNewYearsDay(date);
  const inWeekOne = isBeforeFriday(newYearsDate);
  const newYearsMs = newYearsDate.valueOf();
  const newYearsDay = newYearsDate.getUTCDay(); // 0-6 Sun-Sat
  const weekOneStartMs = inWeekOne
    ? newYearsMs - newYearsDay * ONE_DAY_MS
    : newYearsMs + (7 - newYearsDay) * ONE_DAY_MS;
  return new Date(weekOneStartMs);
}

export function getWeekNumberFromISOString(IsoIn: string) {
  const newDate = new Date(IsoIn);
  // newDate.setUTCHours(0, 0, 0, 1);

  const date = new Date(newDate.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  );

  // const newDateMs = newDate.valueOf();
  // return getWeekNumberFromMilliseconds(newDateMs);
}
export function getWeekNumberFromMilliseconds(dateInMs: number) {
  const dateIn = new Date(dateInMs);

  const weekOneStart = getWeekOneStart(dateIn);
  const weekOneStartMs = weekOneStart.valueOf();

  const afterWeekOne = dateInMs > weekOneStartMs;

  if (afterWeekOne) {
    return Math.ceil((dateInMs - weekOneStartMs) / ONE_WEEK_MS);
  }

  const previousYearWeekOneStart = getPreviousYearWeekOneStart(dateIn);
  const previousYearWeekOneStartMs = previousYearWeekOneStart.valueOf();

  return Math.ceil((dateInMs - previousYearWeekOneStartMs) / ONE_WEEK_MS);
}

export function convertISODateToMilliseconds(dateIsoIn: string) {
  const newDate = new Date(dateIsoIn);
  newDate.setUTCHours(0, 0, 0, 1);
  return newDate.valueOf();
}

export function getCurrentWeekNumber() {
  const currentDate = new Date().toISOString();
  return getWeekNumberFromISOString(currentDate);
}
export function getCurrentYear() {
  const currentDate = new Date();
  return currentDate.getUTCFullYear();
}
export function getCurrentWeekStart() {
  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0);
  const currentIsoString = currentDate.toISOString();
  return getWeekNumberFromISOString(currentIsoString);
}

// export function getCurrentDayMidnight() {}

// function getCurrentWeekLimitsMS() {
//     const currentDate = new Date();
//     const currentDay = currentDate.getUTCDay(); // 0-6 Sun-Sat
//     const currentMS = currentDate.setUTCHours(0, 0, 0, 0).valueOf();
//     const weekStartOffset = currentDay * ONE_DAY_MS;
//     const weekEndOffset = (6 - currentDay) * ONE_DAY_MS;
//     const weekStart = currentMS - weekStartOffset;
//     const weekEnd = currentMS + weekEndOffset;
//     return [weekStart, weekEnd];
// }

export function dateIsThisWeek(ISOdateIn: string) {
  const issueWeek = getWeekNumberFromISOString(ISOdateIn);
  const thisWeek = getWeekNumberFromISOString(new Date().toISOString());
  return issueWeek === thisWeek;
}
export function dateIsNextWeek(ISOdateIn: string) {
  const issueWeek = getWeekNumberFromISOString(ISOdateIn);
  const nextWeek = getWeekNumberFromISOString(new Date().toISOString()) + 1;
  return issueWeek === nextWeek;
}
export function dateIsLastWeek(ISOdateIn: string) {
  const issueWeek = getWeekNumberFromISOString(ISOdateIn) + 5;
  const lastWeek = getWeekNumberFromISOString(new Date().toISOString()) + 4;
  return issueWeek === lastWeek;
}
export function dateIsLastFortnight(ISOdateIn: string) {
  const issueWeek = getWeekNumberFromISOString(ISOdateIn) + 5;
  const lastWeek = getWeekNumberFromISOString(new Date().toISOString()) + 4;

  const lastFortnight =
    getWeekNumberFromISOString(new Date().toISOString()) + 3;
  return issueWeek === lastFortnight || lastWeek === issueWeek;
}

export function adjustDateToWorkday(dateIn: Date) {
  const currentDayIndex = dateIn.getDay();
  const adjustmentAmount =
    ONE_DAY_MS *
    Math.max(
      0,
      (currentDayIndex < 1 ? currentDayIndex + 7 : currentDayIndex) - 5,
    );
  const dateOut = new Date(dateIn.valueOf() - adjustmentAmount);
  return dateOut;
}
function adjustDateToPreviousDay(dateIn: Date) {
  const dateOut = new Date(dateIn.valueOf() - ONE_DAY_MS);
  return dateOut;
}

export function adjustDateToPreviousWorkday(dateIn: Date) {
  return adjustDateToWorkday(adjustDateToPreviousDay(dateIn));
}
export function convertIsoDateToShortDateString(dateIn: string) {
  return dateIn
    .split("T")[0]
    .split("-")
    .toReversed()
    .map((value) => {
      if (value.length > 2) {
        return value.slice(2);
      } else {
        return value;
      }
    })
    .join("/");
}
export function convertDateToShortDateString(dateIn: Date) {
  return convertIsoDateToShortDateString(dateIn.toISOString());
}

export function convertIsoDateToDayDateComboString(isoString: string) {
  return `${getDayOfWeekShortIsoString(isoString)} ${convertIsoDateToShortDateString(isoString)}`;
}
export function convertDateToDayDateComboString(dateIn: Date) {
  return convertIsoDateToDayDateComboString(dateIn.toISOString());
}
export function getIsoStringFromRelativeWeekNumber(
  weekNumber = -2,
  date?: Date,
) {
  const thisWeek = getFirstDayOfWeek(date);
  if (weekNumber === 0) {
    return thisWeek.toISOString();
  }
  thisWeek.setDate(thisWeek.getDate() + weekNumber * 7);
  return thisWeek.toISOString();
}

export function getFirstDayOfWeek(date = new Date()) {
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1; // Set to Monday
  const firstDay = new Date(date);
  firstDay.setDate(firstDay.getDate() - diff);
  firstDay.setUTCHours(1, 1);
  return firstDay;
}
export function modifyWeekNumber(modifyBy: number, date = new Date()) {
  date.setDate(date.getDate() + modifyBy * 7);
  return getWeekNumberFromISOString(date.toISOString());
}
export function getLastSundayOfMonth(year: number, month: number) {
  const workingDate = new Date(year, month + 1, 1, 1);
  const weekday = workingDate.getDay();
  const dayDiff = weekday === 0 ? 7 : weekday;
  workingDate.setDate(workingDate.getDate() - dayDiff);
  return workingDate;
}
function getStartBstMS() {
  const today = new Date();
  const startDate = getLastSundayOfMonth(today.getFullYear(), 2);
  return startDate.valueOf();
}
function getEndBstMS() {
  const today = new Date();
  const startDate = getLastSundayOfMonth(today.getFullYear(), 9);
  return startDate.valueOf();
}

export function dateIsBST(dateIn?: Date) {
  const date = dateIn || new Date();
  const dateValue = date.valueOf();
  return dateValue >= getStartBstMS() && dateValue <= getEndBstMS();
}
