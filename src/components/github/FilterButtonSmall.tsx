

export default function FilterButtonSmall({
  state,
  setState,
  message,
}: {
  state: string;
  setState: (valueIn: string) => void; // eslint-disable-line
  message?: string;
}) {
  return (
    <button
      type="button"
      className={`text-center text-sm border-transparent hover:underline underline-offset-4 border-none w-fit h-fit py-1 px-1 rounded-lg transition box-border bg-transparent font-light ${message === state ? "text-black dark:text-white underline" : "text-neutral-500 dark:text-neutral-400"}`}
      onClick={() => {
        message && setState(message);
      }}
    >
      {message}
    </button>
  );
}
