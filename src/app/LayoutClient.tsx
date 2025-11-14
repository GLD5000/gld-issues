"use client";

import HeaderV2 from "@/components/github/header/HeaderV2";
import MainContentLink from "@/components/github/header/MainContentLink";
import MainWrapper from "@/components/github/header/MainWrapper";
import { useStore } from "@/zustand/zustand";
import { useEffect } from "react";

export default function LayoutClient({
  children,
  accessLevel,
}: {
  children: React.ReactNode;
  accessLevel: string;
}) {
  const { darkMode: colourTheme } = useStore((state) => state);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      useStore.setState({ accessLevel });
    }
  }, [accessLevel]);

  // if (colourTheme === null) return null;
  return (
    <div
      id="theme-wrapper"
      className={`min-h-screen w-full  transition ${
        colourTheme ? "dark bg-black" : "bg-white"
      }`}
    >
      <MainContentLink />
      <HeaderV2 />
      <MainWrapper>{children}</MainWrapper>
    </div>
  );
}
