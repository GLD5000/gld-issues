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
    <div className="grid mx-auto border-solid rounded-lg w-full overflow-x-auto">
      <h3 className="text-base text-inherit underline underline-offset-4">
        Task List
      </h3>
      {taskList.map((task, index) => (
        <GitIssueCardBodyTodo
          key={`task-${index}`}
          task={task}
          clickHandler={todoTaskClickHandler(task)}
        />
      ))}
    </div>
  );
}
