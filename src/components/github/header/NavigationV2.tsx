"use client";
import { SyntheticEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const routesObject: { [key: string]: Record<string, string> } = {
  home: {
    url: "/",
    title: "Home",
  },
  content: {
    url: "/content",
    title: "Content",
  },
  docs: {
    url: "/docs",
    title: "Docs",
  },
  tools: {
    url: "/tools",
    title: "Tools",
  },
};
export default function NavigationV2() {
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    let run = true;
    if (run && window.location.pathname) {
      const path = window.location.pathname;
      const location =
        path.length === 1 ? "home" : path.replace("/", "").split("/")[0];

      setSearchValue(routesObject[location].title);
    }

    return () => {
      run = false;
    };
  }, []);

  const options = Object.values(routesObject).map((entry) => (
    <option key={entry.url}>{entry.title}</option>
  ));
  const links = Object.values(routesObject).map((entry) => {
    if (searchValue === entry.title) {
      return (
        <a
          className="text-black dark:text-white decoration-2 underline underline-offset-4 hover:scale-105 transition"
          href={entry.url}
          key={entry.url}
        >
          {entry.title}
        </a>
      );
    }
    return (
      <a
        className="text-black dark:text-white hover:scale-105 transition"
        href={entry.url}
        key={entry.url}
      >
        {entry.title}
      </a>
    );
  });

  const lookupUrls = Object.fromEntries(
    Object.values(routesObject).map((entry) => [entry.title, entry.url]),
  );
  const router = useRouter();

  function handleChange(e: SyntheticEvent<HTMLSelectElement>) {
    const currentValue = e.currentTarget.value;
    setSearchValue(currentValue);
    if (lookupUrls[currentValue]) {
      router.push(`${lookupUrls[currentValue]}`);
    }
  }
  return (
    <>
      <select
        aria-label="Navigate"
        id="main-nav"
        className={`md:hidden mx-auto break-words rounded m-2 h-fit text-center bg-white p-2 text-black dark:bg-black dark:text-white hover:invert focus:invert transition`}
        onClick={handleChange}
        onChange={handleChange}
        value={searchValue}
      >
        {options}
      </select>
      <div className="hidden md:flex flex-row gap-8">{links}</div>
    </>
  );
}
