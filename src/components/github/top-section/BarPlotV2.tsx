import TasksBarPlot from "./TasksBarPlot";

type BarPlotProps = {
  height?: number;
  data: {
    title: string;
    total: number;
    closed: number;
    blocked: number;
    testing: number;
  }[];
  categoryFilter: string;
  setCategoryFilter: (valueIn: string) => void;
};

export const BarPlotV2 = ({
  height = 24,
  data,
  categoryFilter,
  setCategoryFilter,
}: BarPlotProps) => {
  if (data.length < 2) {
    height *= 3;
  } else if (data.length < 5) {
    height *= 2;
  }
  const sortedData = data.sort((a, b) => b.total - a.total);

  return (
    <div className="w-full h-auto box-border grid gap-0.5">
      {sortedData.map((group, index) => (
        <button
          type="button"
          onClick={() => {
            if (categoryFilter === group.title) {
              setCategoryFilter("");
            } else {
              setCategoryFilter(group.title || "");
            }
          }}
          key={`${index}-flex`}
          className="group grid grid-cols-[auto_1fr] box-border bg-transparent border-none p-0 m-0 w-full h-auto cursor-pointer hover:brightness-110 transition items-center"
        >
          <span className="block w-[300px] text-neutral-500 dark:text-neutral-400 text-base tracking-tighter box-border text-left group-hover:underline underline-offset-2 font-bold">{`${group.title} (${group.closed} / ${group.total})`}</span>
          <TasksBarPlot
            barNumbers={[
              group.closed / group.total,
              group.testing / group.total,
              (group.total - group.closed - group.blocked - group.testing) /
                group.total,
              group.blocked / group.total,
            ]}
            height={height}
          />
        </button>
      ))}
    </div>
  );
};
