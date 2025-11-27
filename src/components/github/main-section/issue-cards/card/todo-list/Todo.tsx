import DeleteTodo from "./DeleteTodo";
import CompleteTodo from "./CompleteTodo";
import EditTodo from "./EditTodo";

export default function Todo({
  task,
  todoTaskClickHandler,
  deleteTodoClickHandler,
  todoEditTaskBlurHandler,
}: {
  task: string;
  todoTaskClickHandler: () => void;
  deleteTodoClickHandler: () => void;
  todoEditTaskBlurHandler: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  const isTicked = task.indexOf("[x]") > -1;
  return (
    <div className="flex w-full gap-4 align-middle justify-between">
      <div className="flex w-full justify-start gap-4">
        <CompleteTodo
          todoTaskClickHandler={todoTaskClickHandler}
          isTicked={isTicked}
        />
        {/* <span className="block">{task.replace(/- \[[ x]\]/, "")}</span> */}
        <EditTodo task={task} onBlurHandler={todoEditTaskBlurHandler} />
      </div>
      <DeleteTodo deleteTodoClickHandler={deleteTodoClickHandler} />
    </div>
  );
}
