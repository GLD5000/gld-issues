import { ReactElement } from "react";
import { SelectiveIssuesJsonShape } from "../useIssues/useIssuesTypes";
import CategoryCards from "./categories/CategoryCards";
// import IssueCards from './IssueCards';

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
  priorityList,
  setPriorityList,
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
    }, //eslint-disable-line
  ) => {}; //eslint-disable-line
  priorityList: string[];
  setPriorityList: (value: string | string[]) => void; //eslint-disable-line
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
      priorityList={priorityList}
      setPriorityList={setPriorityList}
      titleFilter={titleFilter}
      filterSettings={filterSettings}
      categoryFilter={categoryFilter}
      titleFilterElement={titleFilterElement}
      lastUpdated={lastUpdated}
    />
  );
}
