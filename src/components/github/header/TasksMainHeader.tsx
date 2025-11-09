export default function TasksMainHeader({
  title,
  colourTheme,
}: {
  title: string;
  colourTheme: boolean;
}) {
  return (
    <a
      className="group"
      href={`${process.env.NEXT_PUBLIC_GH_URL}issues`}
      target="_blank"
    >
      <h1>
        <span
          className={`w-fit block text-3xl ${
            colourTheme ? "text-white" : "text-black"
          } font-bold  transition group-focus:scale-105 group-hover:scale-105 mx-auto`}
        >
          {title}
        </span>
      </h1>
    </a>
  );
}
