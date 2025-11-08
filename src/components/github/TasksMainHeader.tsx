export default function TasksMainHeader({ title }: { title: string }) {
    return (
        <a
            className="group"
            href={`https://github.com/GLD5000/Dev-2.0/issues`}
            target="_blank"
        >
            <h1 >
                <span className=" w-fit block text-3xl text-black dark:text-white font-bold  transition group-focus:scale-105 group-hover:scale-105 mx-auto">
                    {title}
                </span>
            </h1>
        </a>
    );
}
