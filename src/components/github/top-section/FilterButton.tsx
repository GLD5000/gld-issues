import { useQueryParams } from "@/utils/searchParamsURL";

export default function FilterButton({
  categoryFilter,
  setCategoryFilter,
  message,
}: {
  categoryFilter: string;
  setCategoryFilter: (valueIn: string) => void; // eslint-disable-line
  message?: string;
}) {
  const [viewMode] = useQueryParams("vm", "Category");

  return (
    <button
      type="button"
      className={`text-center text-sm border-inherit border-2 border-solid w-24 h-fit py-1 px-1 rounded-lg  hover:scale-105 focus:scale-105 transition box-border ${message === categoryFilter || (viewMode !== "Open" && categoryFilter === "" && message === "Categories") || (viewMode === "Open" && categoryFilter === "" && message === "All") ? "bg-green-300 text-black" : "bg-transparent text-neutral-500 dark:text-neutral-400"}`}
      onClick={() => {
        if (categoryFilter === message) {
          setCategoryFilter("");
        } else {
          setCategoryFilter(message || "");
        }
      }}
    >
      {message}
    </button>
  );
}
