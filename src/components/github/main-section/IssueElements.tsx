import { ReactElement } from "react";
import { SelectiveIssuesJsonShape } from "../useIssues/useIssuesTypes";
import CategoryCards from "./categories/CategoryCards";

interface IssueElementsProps {
  filteredToDoObject: [string, SelectiveIssuesJsonShape][];
  subCategoryFilter: string[];
  setSubCategoryFilter: (value: string) => void;
  incrementSortMode: (value?: string) => void;
  sortMode: string;
  setIssues: (
    type?: string,

    body?: {
      [key: string]: string;
    }
  ) => void;
  priorityList: string[];
  setPriorityList: (value: string | string[]) => void;
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
}

export default function IssueElements({
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
}: IssueElementsProps) {
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
