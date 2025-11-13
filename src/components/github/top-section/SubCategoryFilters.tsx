import { ReactElement, ReactNode } from "react";
import FilterButtonSmall from "./FilterButtonSmall";
import TasksSortButton from "./TasksSortButton";

export default function SubCategoryFilters({
  titleFilterElement,
  subCategoryFilter,
  setSubCategoryFilter,
  incrementSortMode,
  sortMode,
}: {
  titleFilterElement: ReactElement;
  subCategoryFilter: string[];
  setSubCategoryFilter: (value: string) => void;
  incrementSortMode: (value?: string) => void;
  sortMode: string;
}): ReactNode {
  return (
    <>
      {titleFilterElement}
      <div className="flex flex-wrap gap-1 items-center justify-between">
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-sm font-light">Show:</span>
          {[
            "Deadlines",
            "Completed",
            "Testing",
            "Blocked",
            // 'Other',
          ].map((value, index) => (
            <FilterButtonSmall
              key={`${index}${value}`}
              state={subCategoryFilter.filter((item) => item === value)[0]}
              setState={setSubCategoryFilter}
              message={value}
            />
          ))}
        </div>
        <TasksSortButton
          incrementSortMode={incrementSortMode}
          sortMode={sortMode}
        />
      </div>
    </>
  );
}
