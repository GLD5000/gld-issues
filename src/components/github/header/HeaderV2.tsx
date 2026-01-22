"use client";
import { useStore } from "@/zustand/zustand";
import { useEffect } from "react";
import Link from "next/link";
import SignIn from "@/auth/ClientSignIn";
import GldSvg from "@/components/assets/GldSvg";
import MoonSvg from "@/components/assets/MoonSvg";
import SunSvg from "@/components/assets/SunSvg";
import SvgButtonHeader from "./SvgButtonHeader";
import TasksMainHeader from "./TasksMainHeader";
import { getCurrentWeekNumber } from "@/utils/dates";

export default function HeaderV2() {
  function setThemeToLocalStorage(themeBoolean: boolean) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("theme", themeBoolean.toString());
    }
  }

  function getThemeFromSessionStorage() {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("theme") !== "false";
    }
    return true;
  }
  const { darkMode: colourTheme } = useStore((state) => state);
  const setColourTheme = (value: boolean) =>
    useStore.setState({ darkMode: value });
  function toggleColourTheme() {
    setThemeToLocalStorage(!colourTheme);
    setColourTheme(!colourTheme);
  }
  const currentWeek = getCurrentWeekNumber();

  const title = `Tasks and Issues Week ${currentWeek}`;

  useEffect(() => {
    setColourTheme(getThemeFromSessionStorage());
  }, []);

  function getDarkToggleIcon(isDark: boolean) {
    const wrapper = (
      <div className="aspect-square h-5 text-inherit">
        {isDark ? <SunSvg /> : <MoonSvg />}{" "}
      </div>
    );
    return wrapper;
  }

  return (
    <header
      className={`relative left-0 top-0 z-997 h-fit grid w-full border-x-0 border-solid border-b transition ${
        colourTheme
          ? "dark:border-b-neutral-600 dark:bg-black"
          : "border-b-neutral-300 bg-white"
      }`}
    >
      <nav
        className={`mx-auto w-full p-2 h-fit grid md:grid-cols-[auto_1fr_auto] md:gap-8 items-center transition justify-center  text-base text-white lg:w-body`}
      >
        <Link
          href="https://github.com/GLD5000"
          className={`my-auto mx-auto lg:ml-0 lg:mr-auto flex h-10 w-fit content-center items-center justify-center gap-2 rounded border-2 border-transparent p-1 text-center text-3xl text-black hover:border-current hover:transition dark:text-white  dark:hover:border-white transition ${
            colourTheme ? "text-white" : "text-black"
          }`}
        >
          <div
            className={`h-10 w-10 transition ${colourTheme ? "text-white" : "text-black"}`}
          >
            <GldSvg />
          </div>
        </Link>
        <TasksMainHeader title={title} colourTheme={colourTheme} />

        <div className="mx-auto lg:ml-auto lg:mr-0 flex h-14 w-fit flex-row items-center gap-2 p-2">
          <SignIn />
          <SvgButtonHeader
            clickFunction={toggleColourTheme}
            id="colour-theme-button"
            name="Dark Mode Button"
            className="relative flex h-fit w-fit flex-col overflow-visible rounded px-2 py-[0.85rem] bg-white dark:bg-black border-none text-xs text-black  hover:bg-black   hover:text-white hover:transition  focus:transition dark:text-white  dark:hover:bg-white dark:hover:text-black"
            textElement={
              <span className="absolute top-[calc(100%-0.95rem)] w-full rounded-t-none bg-transparent text-inherit ">
                {colourTheme ? "Light" : "Dark"}
              </span>
            }
            svg={getDarkToggleIcon(colourTheme)}
          />
        </div>
      </nav>
    </header>
  );
}
