// import { useQueryParams, useQueryParamsArray } from "@/utils/searchParamsURL";
// import { useState } from "react";
import { issueIsBlocked, SelectiveIssue } from './useIssues';

export function useIssueObjects() {
    // const [issuesObject, setIssues] = useIssues();
    // const [loadingString, setLoadingString] = useState('');
    // const [titleFilter, setTitleFilter] = useQueryParams('title');
    // const [categoryFilter, setCategoryFilter] = useQueryParams('cat');
    // const [subCategoryFilter, setSubCategoryFilter] = useQueryParams('show');
    // const [listIssueArray, setListIssue] = useQueryParamsArray('priority');
    // const [viewMode, setViewMode] = useQueryParams('mode', 'Category');
    // return openIssues , filteredToDoObject, categoryData
}

function filterToDoObject(
    objectToFilter: { [key: string]: SelectiveIssue[] },
    categoryFilter: string,
    titleFilter: string
) {
    return Object.entries(objectToFilter).filter(
        (entry) =>
            entry[1].length > 0 &&
            (categoryFilter.length === 0 ||
                categoryFilter === 'Open' ||
                categoryFilter === 'Deadlines' ||
                (categoryFilter === 'Blocked' &&
                    entry[1].some((issue) => issueIsBlocked(issue))) ||
                (categoryFilter === 'Completed' &&
                    entry[1].some((issue) => issue.state === 'closed')) ||
                entry[0] === categoryFilter) &&
            entry[1].some(
                (issue) =>
                    titleFilter.length === 0 ||
                    issue.title
                        .toLowerCase()
                        .indexOf(titleFilter.toLowerCase()) > -1
            )
    );
}

function getObjectToFilter(
    categoryFilter: string,
    viewMode: string,
    timeObject: { [key: string]: SelectiveIssue[] },
    toDoObject: { [key: string]: SelectiveIssue[] },
    openIssues: { [key: string]: SelectiveIssue[] }
) {
    return categoryFilter === 'This Week' ||
        categoryFilter === 'Next Week' ||
        viewMode === 'Deadline'
        ? timeObject
        : viewMode === 'Category'
          ? toDoObject
          : openIssues;
}

export function GetFilteredTodoObject(
    titleFilter: string,
    categoryFilter: string,
    viewMode: string,
    timeObject: { [key: string]: SelectiveIssue[] },
    toDoObject: { [key: string]: SelectiveIssue[] },
    openIssues: { [key: string]: SelectiveIssue[] }
) {
    const objectToFilter = getObjectToFilter(
        categoryFilter,
        viewMode,
        timeObject,
        toDoObject,
        openIssues
    );
    const filteredToDoObject = filterToDoObject(
        objectToFilter,
        categoryFilter,
        titleFilter
    );
    return filteredToDoObject;
}

export function getCategoryData(
    filteredToDoObject: [string, SelectiveIssue[]][]
) {
    return filteredToDoObject
        ?.filter((entry) => entry[1].length > 0)
        .map((entry) => {
            return {
                title: entry[0],
                total: entry[1].length,
                closed: entry[1].filter((issue) => issue.state === 'closed')
                    .length,
                blocked: entry[1].filter((issue) => issueIsBlocked(issue))
                    .length,
                testing: entry[1].filter(
                    (issue) =>
                        issue.state === 'open' &&
                        issue.labels.some((label) => label.name === 'testing')
                ).length,
            };
        });
}
