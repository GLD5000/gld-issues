export default function DeadlineFlagButton({
  handleDeadlineViewClick,
  deadlineFlagColour,
  deadlineFlagValue,
}: {
  handleDeadlineViewClick: () => void;
  deadlineFlagColour: string;
  deadlineFlagValue: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        handleDeadlineViewClick();
      }}
      className={`grid relative cursor-pointer w-full h-full p-1 box-border my-auto text-center rounded-none text-black dark:text-white items-center border-2 border-solid bg-transparent ${deadlineFlagColour || "border-black dark:border-white"}`}
    >
      <span className="block leading-[0.8] text-sm">{deadlineFlagValue}</span>
    </button>
  );
}
