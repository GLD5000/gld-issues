import React, { ReactElement } from 'react';
import CategoryCards from './CategoryCards';
// import IssueCards from './IssueCards';
import { SelectiveIssuesJsonShape } from './useIssues';

export default function IssueElements({
    hasNoIssues,
    issues,
    // openIssues,
    // viewMode,
    filteredToDoObject,
    subCategoryFilter,
    setSubCategoryFilter,
    incrementSortMode,
    sortMode,
    setIssues,
    listIssueArray,
    setListIssue,
    titleFilter,
    filterSettings,
    categoryFilter,
    titleFilterElement,
    lastUpdated,
}: {
    hasNoIssues: boolean;
    issues: SelectiveIssuesJsonShape | null;
    // openIssues: SelectiveIssuesJsonShape;
    // viewMode: string;
    filteredToDoObject: [string, SelectiveIssuesJsonShape][];
    subCategoryFilter: string[];
    setSubCategoryFilter: (value: string) => void; //eslint-disable-line
    incrementSortMode: (value?: string) => void; //eslint-disable-line
    sortMode: string;
    setIssues: (
        type?: string, //eslint-disable-line
        //eslint-disable-next-line
        body?: {
            [key: string]: string; //eslint-disable-line
        } //eslint-disable-line
    ) => {}; //eslint-disable-line
    listIssueArray: string[];
    setListIssue: (value: string | string[]) => void; //eslint-disable-line
    titleFilter: string;
    filterSettings: {
        notFiltering: boolean;
        isFilteringCompleted: boolean;
        isFilteringBlocked: boolean;
        isFilteringDeadline: boolean;
    };
    categoryFilter: string;
    titleFilterElement: ReactElement;
    lastUpdated: string;
}) {
    if (hasNoIssues || !issues) return null;
    return (
        <CategoryCards
            filteredToDoObject={filteredToDoObject}
            subCategoryFilter={subCategoryFilter}
            setSubCategoryFilter={setSubCategoryFilter}
            incrementSortMode={incrementSortMode}
            sortMode={sortMode}
            setIssues={setIssues}
            listIssueArray={listIssueArray}
            setListIssue={setListIssue}
            titleFilter={titleFilter}
            filterSettings={filterSettings}
            categoryFilter={categoryFilter}
            titleFilterElement={titleFilterElement}
            lastUpdated={lastUpdated}
        />
    );
}
