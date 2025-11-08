export default function DeadlineModeButton({
    handleDateModeClick,
    dateModeValue,
}: {
    handleDateModeClick?: () => void;
    dateModeValue?: string;
}) {
    if (!handleDateModeClick || !dateModeValue)
        return (
            <div
                className={`grid relative py-2 px-6 box-border border-none text-sm w-fit h-6 my-auto text-right rounded-none align-middle text-neutral-500 cursor-default dark:text-neutral-400 items-center font-Avenir-medium bg-transparent`}
            >
                <span className="block leading-none w-fit">{'Due:'}</span>
            </div>
        );
    return (
        <button
            type="button"
            onClick={() => {
                handleDateModeClick();
            }}
            className={`grid relative py-2 px-6 box-border border-none text-sm cursor-pointer w-fit h-6 my-auto text-right rounded-none align-middle text-neutral-500 dark:text-neutral-400 items-center font-Avenir-medium bg-transparent hover:underline transition  underline-offset-4`}
        >
            <span className="block leading-none w-fit">{dateModeValue}</span>
        </button>
    );
}
