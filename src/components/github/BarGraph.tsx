// import { BarPlot } from './BarPlot';
import { SelectiveIssuesJsonShape } from "./useIssues/useIssues";
import { BarPlotV2 } from "./BarPlotV2";

export default function BarGraph({
  subTitle,
  categoryData,
  categoryFilter,
  categorySetter,
  toDoObject,
}: {
  subTitle: string;
  categoryData: {
    title: string;
    total: number;
    closed: number;
    blocked: number;
    testing: number;
  }[];
  categoryFilter: string;
  categorySetter: (input: string) => void; //eslint-disable-line
  toDoObject: {
    [key: string]: SelectiveIssuesJsonShape;
  };
}) {
  return (
    <details open className="hidden md:grid gap-0 w-full h-auto group/graph">
      <summary className="w-full grid grid-cols-[auto_1fr] items-center rounded-none mb-2 cursor-pointer">
        <span className="text-center right-0 top-1 ease-out duration-200 transition-transform group-open/graph:rotate-180 group-open/graph:ease-in rounded-[50%] w-8 h-8 p-1 box-border block ">
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
        <div className="text-xl text-left text-black dark:text-white">{`${subTitle} - (${
          Object.values(toDoObject)
            .flatMap((cat) => [...cat])
            .filter((issue) => issue.state !== "open").length
        } / ${Object.values(toDoObject).flatMap((cat) => [...cat]).length} completed)`}</div>
      </summary>
      <BarPlotV2
        data={categoryData}
        categoryFilter={categoryFilter}
        setCategoryFilter={categorySetter}
      />
      {/* <BarPlot
                data={categoryData}
                categoryFilter={categoryFilter}
                setCategoryFilter={categorySetter}
            /> */}
    </details>
  );
}
