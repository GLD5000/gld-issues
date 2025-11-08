'use client';
import React from 'react';
import {
    getAdjustedDeadlineDate,
    SelectiveIssue,
    issueIsGTM,
} from './useIssues';
import { getProgressState } from './GitIssueDeadlineDivider';
import { adjustDateToPreviousWorkday } from '@/utils/dates';

export default function GitIssueDeadlineFlag({
    issue,
}: {
    issue: SelectiveIssue;
}) {
    const deadlineDate = getAdjustedDeadlineDate(issue);
    if (!deadlineDate || issue.state === 'closed') return null;
    const progressState = issueIsGTM(issue)
        ? getProgressState(adjustDateToPreviousWorkday(deadlineDate))
        : getProgressState(deadlineDate);
    if (!progressState) return null;
    return (
        <div
            className={`grid relative cursor-default p-1 box-border w-36 h-6 my-auto text-center rounded-none align-middle text-black dark:text-white items-center font-Avenir-medium border-2 border-solid ${progressState.border || 'border-black dark-border-white'}`}
        >
            <span className="block leading-[0.8]">{progressState.msg}</span>
        </div>
    );
}
