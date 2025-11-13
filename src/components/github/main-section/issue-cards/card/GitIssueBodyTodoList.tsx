import GitIssueCardBodyTodo from "./GitIssueCardBodyTodo";

export default function GitIssueBodyTodoList({
  taskList,
  issueNumber,
  setIssues,
}: {
  taskList?: string[];
  issueNumber: number;
  setIssues: (
    type?: string,
    body?: {
      [key: string]: string;
    },
  ) => void;
}) {
  if (!taskList || taskList.length === 0) return null;
  return (
    <div className="grid border border-neutral-500 dark:border-neutral-400 mx-auto border-solid p-3 rounded-lg w-fit max-w-full">
      <h3 className="text-base text-inherit underline underline-offset-4">
        Task List
      </h3>
      {taskList.map((task, index) => (
        <GitIssueCardBodyTodo
          key={`task-${index}`}
          task={task}
          issueNumber={issueNumber}
          setIssues={setIssues}
        />
      ))}
    </div>
  );
}
