"use client";
import { useIssues } from "./useIssues/useIssues";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import {
  convertDateToDayDateComboString,
  dateIsBST,
  getCurrentWeekNumber,
} from "@/utils/dates";
import {
  GetFilteredTodoObject,
  getCategoryData,
} from "./useIssues/useIssuesObjects";

import BarGraph from "./top-section/BarGraph";
import TasksTopButtons from "./top-section/TasksTopButtons";
import IssueElements from "./main-section/IssueElements";
import TasksCategoryFilter from "./top-section/TasksCategoryFilter";
import TasksTitleFilter from "./top-section/TasksTitleFilter";
import { SelectiveIssuesJsonShape } from "./useIssues/useIssuesTypes";
import { makeWeeklyToDoObject } from "./useIssues/useIssuesUtils";
import {
  useCategoryFilter,
  usePriorityList,
  useSortMode,
  useSubCategoryFilter,
  useTitleFilter,
  useViewMode,
} from "./useIssues/useIssuesParameterHooks";
import TasksPrioritySection from "./top-section/TasksPrioritySection";

export default function GitTasks() {
  const [issuesObject, setIssues] = useIssues();
  const [previousUpdate, setPreviousUpdate] = useState("");
  const [titleFilter, setTitleFilter] = useTitleFilter();
  const [categoryFilter, setCategoryFilter] = useCategoryFilter();
  const [subCategoryFilter, setSubCategoryFilter] = useSubCategoryFilter();
  const [priorityList, setPriorityList] = usePriorityList();
  const [viewMode, setViewMode] = useViewMode();
  const [sortMode, incrementSortMode] = useSortMode();
  if (!issuesObject) return <LoadingSpinner />;
  const currentWeek = getCurrentWeekNumber();
  const {
    issues,
    metadata: { lastUpdated },
  } = issuesObject;
  const currentDate = new Date();
  // const title = `Tasks and Issues Week ${currentWeek}`;
  const subTitle = convertDateToDayDateComboString(currentDate);
  const hasNoIssues = !issues || issues.length === 0 || issues === null;
  if (hasNoIssues) return <LoadingSpinner />;

  const { categoriesObject: toDoObject, timeObject } = makeWeeklyToDoObject(
    issues,
    currentWeek,
  );
  const [date, time] = getLastUpdated(lastUpdated);
  const isLoading = getIsLoading(lastUpdated, previousUpdate);
  const openIssues = getOpenIssues(issues);
  const filteredToDoObject = GetFilteredTodoObject(
    titleFilter,
    categoryFilter,
    viewMode,
    timeObject,
    toDoObject,
    { Open: openIssues },
  );
  const categoryData = getCategoryData(filteredToDoObject);

  const filterSettings = getFilterSettings(categoryFilter);
  return (
    <div className="text-black dark:text-white px-1 sm:px-6 md:px-8 max-w-7xl w-full mx-auto">
      <div className="text-inherit text-base sm:p-3 grid gap-2 w-full">
        {/* <TasksMainHeader title={title} /> */}
        <div className="flex flex-wrap gap-2 w-full">
          <div className="text-inherit text-sm grid gap-2 w-full h-fit max-w-[min(100%,70rem)]">
            {issues && (
              <BarGraph
                subTitle={subTitle}
                categoryData={categoryData}
                categoryFilter={categoryFilter}
                categorySetter={categorySetter}
                toDoObject={toDoObject}
              />
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <TasksCategoryFilter
            categoryFilter={categoryFilter}
            categorySetter={categorySetter}
            toDoObject={toDoObject}
            // setCategoryFilter={setCategoryFilter}
            // setSubCategoryFilter={setSubCategoryFilter}
            clearAllFilters={clearAllFilters}
          />
        </div>

        <TasksTopButtons
          isLoading={isLoading}
          setPreviousUpdate={setPreviousUpdate}
          lastUpdated={lastUpdated}
          setIssues={setIssues}
          date={date}
          time={time}
        />
        <TasksPrioritySection
          priorityList={priorityList}
          issues={issues}
          setIssues={setIssues}
          setPriorityList={setPriorityList}
          lastUpdated={lastUpdated}
        />
        {issues && (
          <IssueElements
            hasNoIssues={hasNoIssues}
            issues={issues}
            // openIssues={openIssues}
            setIssues={setIssues}
            priorityList={priorityList}
            setPriorityList={setPriorityList}
            filteredToDoObject={filteredToDoObject}
            subCategoryFilter={subCategoryFilter}
            setSubCategoryFilter={setSubCategoryFilter}
            incrementSortMode={incrementSortMode}
            sortMode={sortMode}
            // viewMode={viewMode}
            titleFilter={titleFilter}
            filterSettings={filterSettings}
            categoryFilter={categoryFilter}
            lastUpdated={lastUpdated}
            titleFilterElement={
              <TasksTitleFilter
                setTitleFilter={setTitleFilter}
                titleFilter={titleFilter}
                clearAllFilters={clearAllFilters}
              />
            }
          />
        )}
      </div>
    </div>
  );

  function categorySetter(input: string) {
    if (input === "Categories") {
      setCategoryFilter("");
      setViewMode("Category");
      setTitleFilter("");
      incrementSortMode("Deadline");
      setSubCategoryFilter("DELETE");
    } else if (input === "") {
      setCategoryFilter(input);
      setTitleFilter("");
      setViewMode("Category");
      incrementSortMode("Deadline");
      setSubCategoryFilter("DELETE");
    } else if (input === "All") {
      setCategoryFilter("");
      setTitleFilter("");
      setViewMode("Open");
      incrementSortMode("Created");
      setSubCategoryFilter("DELETE");
    } else if (input === "Completed") {
      setCategoryFilter(input);
      setTitleFilter("");
      setViewMode("Category");
      setSubCategoryFilter("DELETE");
      incrementSortMode("Deadline");
    } else if (
      input === "Deadlines" ||
      input === "Later" ||
      input.toLowerCase().indexOf("week") > -1
    ) {
      setCategoryFilter(input);
      setTitleFilter("");
      setViewMode("Deadline");
      setSubCategoryFilter("DELETE");
    } else {
      setCategoryFilter(input);
      setTitleFilter("");
      setViewMode("Category");
      setSubCategoryFilter("DELETE");
    }
  }
  function clearAllFilters(excludeCategory = false) {
    setTitleFilter("");
    if (!excludeCategory) setCategoryFilter("");
    setViewMode("Category");
    setSubCategoryFilter("DELETE");
    incrementSortMode("Deadline");
  }
}

function getOpenIssues(issues: SelectiveIssuesJsonShape) {
  return issues.filter((issue) => issue.state === "open");
}

function getFilterSettings(categoryFilter: string) {
  const isFilteringCompleted =
    categoryFilter.length > 0 && categoryFilter === "Completed";
  const isFilteringBlocked =
    categoryFilter.length > 0 && categoryFilter === "Blocked";
  const isFilteringDeadline =
    categoryFilter.length > 0 && categoryFilter === "Deadlines";
  const notFiltering =
    !isFilteringBlocked && !isFilteringCompleted && !isFilteringDeadline;
  return {
    notFiltering,
    isFilteringCompleted,
    isFilteringBlocked,
    isFilteringDeadline,
  };
}

function getIsLoading(lastUpdated: string, previousUpdate: string) {
  return lastUpdated === previousUpdate;
}
function getLastUpdated(lastUpdated: string): string[] {
  const date = new Date(lastUpdated);
  const isBst = dateIsBST(date);
  if (isBst) {
    date.setHours(date.getHours() + 1);
  }
  return date.toISOString().split("T");
}
