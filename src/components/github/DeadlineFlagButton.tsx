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
            className={`grid relative cursor-pointer p-1 box-border w-36 h-6 my-auto text-center rounded-none align-middle text-black dark:text-white items-center font-Avenir-medium border-2 border-solid bg-transparent ${deadlineFlagColour || 'border-black dark:border-white'}`}
        >
            <span className="block leading-[0.8] text-sm">
                {deadlineFlagValue}
            </span>
        </button>
    );
}
