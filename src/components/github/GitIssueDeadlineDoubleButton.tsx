'use client';
import React from 'react';
import {
    getAdjustedDeadlineDate,
    getIssueDeadlineDateComboString,
    issueIsGTM,
    SelectiveIssue,
} from './useIssues';
import {
    adjustDateToPreviousWorkday,
    dateIsFri,
    dateIsSatSun,
    getDayOfWeekShort,
    getWeekNumberFromMilliseconds,
    timeDiffWorkDays,
} from '@/utils/dates';
import DeadlineFlagButton from './DeadlineFlagButton';
import DeadlineModeButton from './DeadlineModeButton';
import { useDateMode, useDeadlineViewMode } from './tasksQueryHooks';

export default function GitIssueDeadlineDoubleButton({
    issue,
}: {
    issue: SelectiveIssue;
}) {
    const [dateMode, toggleDateMode] = useDateMode();
    const [deadlineViewMode, toggleDeadlineViewMode] = useDeadlineViewMode();
    const deadlineDate = getAdjustedDeadlineDate(issue);
    if (!deadlineDate || issue.state === 'closed') return null;
    const deadlineData = getProgressState(deadlineDate);
    const isGTM = issueIsGTM(issue);
    if (!deadlineData) return null;
    if (!isGTM) {
        return (
            <div
                className={`flex gap-0 text-sm w-fit ml-auto mr-[2px] h-7 justify-end box-border rounded-none border-none p-0`}
            >
                <DeadlineModeButton />
                <DeadlineFlagButton
                    handleDeadlineViewClick={toggleDeadlineViewMode}
                    deadlineFlagColour={deadlineData.border}
                    deadlineFlagValue={
                        deadlineViewMode === 'days'
                            ? deadlineData.msg
                            : deadlineData.week
                    }
                />
            </div>
        );
    }
    const buildData = getProgressState(
        adjustDateToPreviousWorkday(deadlineDate)
    );
    const liveData = getIssueDeadlineDateComboString(issue);

    const lookupDeadlineData: { [key: string]: Record<string, string> } = {
        live: {
            type: 'Live:',
            value: liveData || '',
        },
        test: {
            type: 'Testing:',
            value:
                deadlineViewMode === 'days'
                    ? deadlineData.msg
                    : deadlineData.week,
        },
        build: {
            type: 'Due:',
            value: deadlineViewMode === 'days' ? buildData.msg : buildData.week,
        },
    };
    const deadlineFlagValue = lookupDeadlineData[dateMode || 'build'].value;
    const deadlineFlagColour = deadlineData.border;
    const dateModeValue = lookupDeadlineData[dateMode || 'build'].type;
    return (
        <div
            className={`flex justify-end gap-0 text-sm w-fit ml-auto mr-[2px] box-border rounded-none border-none p-0`}
        >
            <DeadlineModeButton
                handleDateModeClick={toggleDateMode}
                dateModeValue={dateModeValue}
            />
            <DeadlineFlagButton
                handleDeadlineViewClick={toggleDeadlineViewMode}
                deadlineFlagColour={deadlineFlagColour}
                deadlineFlagValue={deadlineFlagValue}
            />
        </div>
    );
}

export function getProgressState(deadlineDate: Date) {
    // const goLive = deadlineDate;
    const buildDay = deadlineDate;
    const currentDay = new Date(new Date().toISOString().split('T')[0]);
    const isWeekend = dateIsSatSun(currentDay);
    const isFriday = dateIsFri(currentDay);
    const daysToBuild = timeDiffWorkDays(currentDay, buildDay);
    const issueMilliseconds = buildDay.valueOf();
    const nowMilliseconds = currentDay.valueOf();
    const currentWeek = getWeekNumberFromMilliseconds(nowMilliseconds);
    const issueDeadlineWeek = getWeekNumberFromMilliseconds(issueMilliseconds);
    const isOverdue = daysToBuild < 0;
    const isDueThisWeek = issueDeadlineWeek === currentWeek;
    const isDueNextWeek = issueDeadlineWeek === currentWeek + 1;
    const dueInTwoWeeks = issueDeadlineWeek === currentWeek + 2;
    const dueMessage = getDueMessage(daysToBuild, isWeekend, isFriday);
    const weekMessage = `${getDayOfWeekShort(buildDay)} ${buildDay.getDate()} - wk ${issueDeadlineWeek}`;
    if (isOverdue) {
        return {
            week: weekMessage,

            msg: dueMessage,
            border: 'border-red-300',
            // days: JSON.stringify({
            //     currentDay: currentDay.valueOf(),
            //     deadlineDate: deadlineDate.valueOf()-currentDay.valueOf(),//.split('T')[0],
            //     buildDay: buildDay.valueOf()-currentDay.valueOf(),//.split('T')[0],
            //     testingDay: testingDay.valueOf()-currentDay.valueOf(),//.split('T')[0],
            //     daysToBuild
            //  }),
        }; // JSON.stringify(buildDay).split('T')[0]};
    } else if (isDueThisWeek) {
        return {
            week: weekMessage,
            msg: dueMessage,
            border: 'border-red-300',
        };
    } else if (isDueNextWeek) {
        return {
            week: weekMessage,
            msg: dueMessage,
            border: 'border-orange-300',
        };
    } else if (dueInTwoWeeks) {
        return {
            week: weekMessage,
            msg: dueMessage,
            border: 'border-green-300',
        };
    } else {
        return {
            week: weekMessage,
            msg: dueMessage,
            border: 'border-blue-300',
        };
    }
}

function getDueMessage(days: number, isWeekend: Boolean, isFriday: Boolean) {
    if (days < 0) {
        return 'Overdue';
    } else if (days === 0) {
        return isWeekend ? 'Monday' : 'Today';
    } else if (days === 1) {
        return isWeekend ? 'Tuesday' : isFriday ? 'Monday' : 'Tomorrow';
    } else {
        return `${days} workdays`;
    }
}
