import GitIssueCardBodyTodo from "./GitIssueCardBodyTodo";

export default function GitIssueBodyTodoList({
  taskList,
  todoTaskClickHandler,
}: {
  taskList?: string[];
  todoTaskClickHandler: (task: string) => () => void;
}) {
  if (!taskList || taskList.length === 0) return null;
  return (
    <div className="grid mx-auto border-solid rounded w-full overflow-x-auto border border-neutral-500 dark:border-neutral-400">
      <h3 className="text-sm font-medium border-b border-neutral-500 dark:border-neutral-400 p-2 bg-neutral-100 dark:bg-neutral-800">
        Task List
      </h3>
      <div className="p-2">

      {taskList.map((task, index) => (
        <GitIssueCardBodyTodo
          key={`task-${index}`}
          task={task}
          clickHandler={todoTaskClickHandler(task)}
        />
      ))}
      </div>
    </div>
  );
}
