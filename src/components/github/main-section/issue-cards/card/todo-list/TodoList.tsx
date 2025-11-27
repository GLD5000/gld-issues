import { Fragment } from "react/jsx-runtime";
import Todo from "./Todo";
import AddNewTodo from "./AddNewTodo";
import { SelectiveIssue } from "@/components/github/useIssues/useIssuesTypes";
import { Dispatch, SetStateAction } from "react";
import { getTodoListFromBodyString } from "@/components/github/useIssues/useIssuesUtils";

export default function TodoList({
  issue,
  setIssues,
  setFullBody,
}: {
  issue: SelectiveIssue;
  setIssues: (
    type?: string,
    body?: {
      [key: string]: string;
    }
  ) => void;
  setFullBody: Dispatch<SetStateAction<string>>;
}) {
  const taskList = getTodoListFromBodyString(issue.body);
  const taskListContent =
    !taskList || taskList.length === 0 ? (
      <AddNewTodo onBlurHandler={todoAddTaskBlurHandler("")} />
    ) : (
      taskList.map((task, index) => {
        return (
          <Fragment key={`task-${index}`}>
            <Todo
              task={task}
              todoTaskClickHandler={todoTaskClickHandler(task)}
              deleteTodoClickHandler={deleteTodoClickHandler(task)}
            />
            {index === taskList.length - 1 && (
              <AddNewTodo onBlurHandler={todoAddTaskBlurHandler(task)} />
            )}
          </Fragment>
        );
      })
    );
  return (
    <div className="grid mx-auto border-solid rounded w-full overflow-x-auto border border-neutral-500 dark:border-neutral-400">
      <h3 className="text-sm font-medium border-b border-neutral-500 dark:border-neutral-400 p-2 bg-neutral-100 dark:bg-neutral-900">
        Task List
      </h3>
      <div className="p-2">{taskListContent}</div>
    </div>
  );
  function todoTaskClickHandler(task: string) {
    const isTicked = task.indexOf("[x]") > -1;

    return () => {
      const updatedTask = isTicked
        ? task.replace("[x]", "[ ]")
        : task.replace("[ ]", "[x]");
      const newBody = issue.body.replace(task, updatedTask);
      setIssues("patchTodo", {
        issue_number: `${issue.number}`,
        body: newBody,
      });
      setFullBody(newBody);
    };
  }
  function deleteTodoClickHandler(task: string) {
    return () => {
      const newBody = issue.body.replace("\n" + task, "");
      setIssues("patchTodo", {
        issue_number: `${issue.number}`,
        body: newBody,
      });
      setFullBody(newBody);
    };
  }
  function todoAddTaskBlurHandler(task: string) {
    return (e: React.FocusEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value;
      if (newValue.length === 0) return;
      const newTask = "\n- [ ] " + e.currentTarget.value;
      const oldBody = issue.body || "";
      const newBody =
        task.length > 0
          ? oldBody.replace(task, newTask)
          : oldBody + "\n" + newTask;
      setIssues("patchTodo", {
        issue_number: `${issue.number}`,
        body: newBody,
      });
      setFullBody(newBody);
    };
  }
}
