export default function DeleteTodo({
  deleteTodoClickHandler,
}: {
  deleteTodoClickHandler: () => void;
}) {
  return (
    <button
      type="button"
      onClick={deleteTodoClickHandler}
      className="block h-4.5 w-4.5 shrink-0 leading-0 rounded-md bg-transparent mb-auto border border-current border-solid text-neutral-500 dark:text-neutral-400 hover:text-black focus:text-black hover:dark:text-white focus:dark:text-white transition box-border"
    >
      <svg
        role="img"
        aria-label="Toggle On"
        width="100%"
        height="100%"
        viewBox="0 0 16 16"
      >
        <path
          className="stroke-current stroke-1"
          d="M 4,4 12,12 M 4,12 12,4"
          style={{
            strokeLinecap: "round",
            fill: "none",
          }}
        />
      </svg>
    </button>
  );
}
