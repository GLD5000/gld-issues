export const barColours = {
  completed: "bg-blue-400 dark:bg-blue-300",
  testing: "bg-neutral-400 dark:bg-neutral-300",
  progressing: "bg-green-400 dark:bg-green-300",
  blocked: "bg-pink-400 dark:bg-pink-300",
};
export default function TasksBarPlot({
  bars,
  height,
}: {
  bars: number[];
  height: number;
}) {
  const barColoursArray = [
    barColours.completed,
    barColours.testing,
    barColours.progressing,
    barColours.blocked,
  ];
  return (
    <div
      className="flex w-full mb-1 p-0 m-0 box-border rounded-md  overflow-clip"
      style={{ height }}
    >
      {barColoursArray.map((colour, index) => (
        <div
          style={{ flexGrow: bars[index] }}
          key={`${colour}-${index}`}
          className={`box-border ${colour}`}
        ></div>
      ))}
    </div>
  );
}
