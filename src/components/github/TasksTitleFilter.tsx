

export default function TasksTitleFilter({
  setTitleFilter,
  // setCategoryFilter,
  // setViewMode,
  // setSubCategoryFilter,
  titleFilter,
  clearAllFilters,
}: {
  setTitleFilter: (value: string) => void; //eslint-disable-line
  // setCategoryFilter: (value: string) => void; //eslint-disable-line
  // setViewMode: (value: string) => void; //eslint-disable-line
  // setSubCategoryFilter: (value: string) => void; //eslint-disable-line
  titleFilter: string;
  clearAllFilters: (excludeCategory?: boolean) => void; //eslint-disable-line
}) {
  return (
    <div className="w-fit flex gap-2 flex-wrap text-sm items-center">
      <input
        className="text-black text-sm placeholder:text-sm placeholder:text-neutral-400 bg-neutral-100 w-60 h-fit px-2 py-1 my-1 leading-[0.8]"
        placeholder="Filter Titles"
        onClick={() => {
          clearAllFilters(true);
        }}
        onChange={(e) => {
          setTitleFilter(e.currentTarget.value);
        }}
        value={titleFilter}
      ></input>
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
