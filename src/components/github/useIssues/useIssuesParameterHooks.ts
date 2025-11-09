import { useQueryParams, useQueryParamsArray } from "@/utils/searchParamsURL";
import { useQueryParamsToggle } from "@/utils/searchParamsURL";

export function useSortMode() {
  return useQueryParamsToggle("sm", ["Deadline", "Created", "Updated"]);
}
export function useDateMode() {
  return useQueryParamsToggle("dm", ["build", "live", "test"]);
}
export function useDeadlineViewMode() {
  return useQueryParamsToggle("dv", ["days", "weeks"]);
}
export function useTitleFilter() {
  return useQueryParams("tf");
}
export function useCategoryFilter() {
  return useQueryParams("cf");
}
export function useSubCategoryFilter() {
  return useQueryParamsArray("scf");
}
export function useViewMode() {
  return useQueryParams("vm", "Category");
}
export function usePriorityList() {
  return useQueryParamsArray("p");
}
