import FilterButton from "./FilterButton";
import CategoryFilterDropdown from "./CategoryFilterDropdown";
import { SelectiveIssuesJsonShape } from "../useIssues/useIssuesTypes";

export default function TasksCategoryFilter({
  categoryFilter,
  categorySetter,
  toDoObject,
  // setCategoryFilter,
  // setSubCategoryFilter,
  clearAllFilters,
}: {
  categoryFilter: string;
  categorySetter: (input: string) => void;
  toDoObject: { [key: string]: SelectiveIssuesJsonShape };
  clearAllFilters: (excludeCategory?: boolean) => void;
}) {
  return (
    <div className="w-fit flex gap-2 flex-wrap items-center">
      <label className="flex gap-2 flex-wrap items-center text-black dark:text-white text-sm font-normal text-center border-none w-fit h-fit py-1 px-0 rounded-lg bg-transparent transition ml-auto mr-2 box-border">
        View mode:
        {[
          "Categories",
          // 'This Week',
          // 'Next Week',
          "Deadlines",
          "Open",
          // 'Completed',
          // 'Blocked',
        ].map((value, index) => (
          <FilterButton
            key={`${index}${value}`}
            categoryFilter={categoryFilter}
            setCategoryFilter={categorySetter}
            message={value}
          />
        ))}
      </label>
      <CategoryFilterDropdown
        categoryFilter={categoryFilter}
        setCategoryFilter={categorySetter}
        optionsArray={Object.entries(toDoObject)
          .filter((entry) => entry[1].length > 0)
          .map((entry) => entry[0])}
      />
      <button
        type="button"
        className="text-black dark:text-white text-sm text-center border-none w-10 h-fit py-1 px-0 rounded-lg bg-transparent hover:scale-105 focus:scale-105 transition ml-auto mr-2 box-border hover:underline"
        onClick={() => {
          clearAllFilters();
        }}
      >
        Clear
      </button>
    </div>
  );
}
