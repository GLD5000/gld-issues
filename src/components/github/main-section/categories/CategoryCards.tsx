import { Fragment, ReactElement } from "react";
import SubCategoryFilters from "../../top-section/SubCategoryFilters";
import {
  SelectiveIssuesJsonShape,
  SelectiveIssue,
} from "../../useIssues/useIssuesTypes";
import {
  getIssueDeadline,
  issueIsBlocked,
  issueIsTesting,
  issueIsParent,
  getIssueDeadlineSortValue,
  getIssueUpdatedSortValue,
} from "../../useIssues/useIssuesUtils";
import IssueCards from "../issue-cards/IssueCards";
import CategoryAddIssueButton from "./CategoryAddIssueButton";

export default function CategoryCards({
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
  const subCategoryRules = getSubCategoryFilterRules();
  return (
    <>
      <SubCategoryFilters
        titleFilterElement={titleFilterElement}
        subCategoryFilter={subCategoryFilter}
        setSubCategoryFilter={setSubCategoryFilter}
        incrementSortMode={incrementSortMode}
        sortMode={sortMode}
      />
      {filteredToDoObject.map((entry, index) => {
        const sectionTitle = (
          <div className="grid w-full">
            <div className="flex flex-wrap gap-2 w-full justify-between">
              <div className="flex flex-wrap w-full gap-6 justify-between items-center">
                <h2 className="block normal-case text-left m-0 w-fit h-auto">
                  {entry[0]}
                  <span className="font-light text-neutral-500 dark:text-neutral-400 text-sm">
                    {` (${entry[1].filter((issue) => issue.state === "closed").length}/${entry[1].length})`}
                  </span>
                </h2>
                <CategoryAddIssueButton
                  label={entry[0]}
                  setIssues={setIssues}
                />
              </div>
            </div>
          </div>
        );
        const issueCards = (
          <div className="w-full p-0 box-border">
            <IssueCards
              issueArray={sortCategory(entry[1], sortMode)
                // .sort((a, b) => a.state.localeCompare(b.state))
                // .sort(
                //     (a, b) =>
                //         -1 + 2 * Number(issueIsGTM(a) === issueIsGTM(b))
                // )
                // .sort((a, b) => {
                //     if (issueIsParent(a) || issueIsParent(b)) {
                //         return -1 * a.title.localeCompare(b.title);
                //     } else {
                //         return a.title.localeCompare(b.title);
                //     }
                // })
                // .sort(
                //     (a, b) =>
                //         Number(getIssueDeadlineSortValue(a)) -
                //         Number(getIssueDeadlineSortValue(b))
                // )
                .filter(filterCategory)}
              setIssues={setIssues}
              priorityList={priorityList}
              setPriorityList={setPriorityList}
              lastUpdated={lastUpdated}
            />
          </div>
        );
        return !categoryFilter ? (
          <details
            open
            className="grid gap-0 w-full h-auto group/subsection box-border"
            key={`${entry[0]}${index}`}
          >
            <summary className="w-full grid grid-cols-[auto_1fr] items-center rounded-none border-none mb-2">
              <span className="text-center text-black dark:text-white right-0 top-1 ease-out duration-200 transition-transform group-open/subsection:rotate-180 group-open/subsection:ease-in rounded-[50%] w-10 h-10 p-1 box-border block">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 16 16"
                  className="rotate-90 w-full h-auto"
                >
                  <path
                    className="dark:stroke-neutral-400 stroke-neutral-500"
                    id="faq-arrow"
                    style={{
                      fill: "none",
                      strokeWidth: "1",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeDasharray: "none",
                      strokeOpacity: 1,
                    }}
                    d="m 7,5 4,3 -4,3"
                  />
                </svg>
              </span>

              {sectionTitle}
            </summary>

            {issueCards}
          </details>
        ) : (
          <Fragment key={`${entry[0]}${index}`}>
            {sectionTitle}
            {issueCards}
          </Fragment>
        );
      })}
    </>
  );
  function getSubCategoryFilterRules() {
    const subCategoryFilterActive = subCategoryFilter.length > 0;
    const showDeadlines =
      subCategoryFilterActive && subCategoryFilter.includes("Deadlines");
    const showCompleted =
      subCategoryFilterActive && subCategoryFilter.includes("Completed");
    const showTesting =
      subCategoryFilterActive && subCategoryFilter.includes("Testing");
    const showBlocked =
      subCategoryFilterActive && subCategoryFilter.includes("Blocked");
    return {
      showDeadlines,
      showCompleted,
      showTesting,
      showBlocked,
    };
  }
  function filterCategory(issue: SelectiveIssue) {
    const subCategoryFilterActive = subCategoryFilter.length > 0;

    const { notFiltering, isFilteringBlocked, isFilteringDeadline } =
      filterSettings;
    const { showDeadlines, showCompleted, showTesting, showBlocked } =
      subCategoryRules;
    // const shouldShowOpen =
    //     showOpen &&
    //     (notFiltering || isFilteringBlocked || isFilteringDeadline);
    const issueIsOpen = issue.state === "open";
    const issueHasDeadline = !!getIssueDeadline(issue);
    const issueHasBlocked = issueIsBlocked(issue);
    const issueHasTesting = issueIsTesting(issue);
    if (subCategoryFilterActive) {
      if (!issueIsOpen && showCompleted) {
        return true;
      }
      if (issueHasBlocked && showBlocked) {
        return true;
      }
      if (issueHasTesting && showTesting) {
        return true;
      }
      if (issueHasDeadline && showDeadlines) {
        return true;
      }
      return false;
    }
    if (!issueHasBlocked && isFilteringBlocked) {
      return false;
    }
    if (!issueHasDeadline && isFilteringDeadline) {
      return false;
    }
    // if (
    //     issueIsOpen &&
    //     !issueHasBlocked &&
    //     !issueHasTesting &&
    //     !issueHasDeadline
    // ) {
    //     return false;
    // }

    return (
      !issueInWorkingList(issue.number, priorityList) &&
      ((notFiltering && titleFilter.length === 0) ||
        (notFiltering &&
          issue.title.toLowerCase().indexOf(titleFilter.toLowerCase()) > -1) ||
        (isFilteringBlocked && issueIsBlocked(issue)) ||
        // (shouldShowOpen && issueIsOpen) ||
        (isFilteringDeadline && getIssueDeadline(issue)))
    );
  }
  function sortCategory(issueArray: SelectiveIssue[], sortMode: string) {
    if (sortMode === "Deadline") {
      return issueArray
        .sort((a, b) => a.state.localeCompare(b.state))
        .sort((a, b) => {
          if (issueIsParent(a) || issueIsParent(b)) {
            return -1 * a.title.localeCompare(b.title);
          } else {
            return a.title.localeCompare(b.title);
          }
        })
        .sort(
          (a, b) =>
            Number(getIssueDeadlineSortValue(a)) -
            Number(getIssueDeadlineSortValue(b)),
        );
    }
    if (sortMode === "Created") {
      return issueArray.toReversed();
    }

    return issueArray
      .sort(
        (a, b) =>
          Number(getIssueUpdatedSortValue(a)) -
          Number(getIssueUpdatedSortValue(b)),
      )
      .toReversed();
  }
}

function issueInWorkingList(issueNumber: number, priorityList: string[]) {
  const testResult = priorityList.includes(`${issueNumber}`);
  return testResult;
}
