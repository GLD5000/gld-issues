import React, { SyntheticEvent } from "react";

export default function CategoryFilterDropdown({
  categoryFilter,
  setCategoryFilter,
  optionsArray,
}: {
  categoryFilter: string;
  setCategoryFilter: (valueIn: string) => void; // eslint-disable-line
  optionsArray: string[];
}) {
  function handleClick(e: SyntheticEvent<HTMLSelectElement>) {
    let newValue = e.currentTarget.value;
    setCategoryFilter(newValue === "Select Category" ? "" : newValue);
  }
  const options = ["Select Category", ...optionsArray].map((name, index) => (
    <option
      className={`${"Select Category" === name ? "text-neutral-400" : "text-black"} font-bold`}
      key={`${name}${index}`}
      value={name}
    >
      {name}
    </option>
  ));
  const currentValue =
    categoryFilter.length > 0 ? categoryFilter : "Select Category";
  return (
    <select
      aria-label="Select Category"
      className={`appearance-none block text-sm cursor-pointer p-1 box-border w-36 h-fit text-center border-2 rounded-none bg-neutral-100 border-black text-black text-ellipsis ${currentValue === "Select Category" ? "text-neutral-400" : "text-black"}`}
      value={currentValue}
      onChange={handleClick}
    >
      {options}
    </select>
  );
}
