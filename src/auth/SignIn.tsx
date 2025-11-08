"use client";
import { useStore } from "@/zustand/zustand";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SignIn() {
  const { accessLevel } = useStore((state) => state);
  const nextAccessLevel: Record<string, string> = {
    public: "auth",
    auth: "dev",
    dev: "public",
  };
  function switchAccessLevel() {
    const newAccessLevel = nextAccessLevel[accessLevel];
    useStore.setState({ accessLevel: newAccessLevel });
    if (newAccessLevel !== "dev") {
      useStore.setState({ darkMode: false });
    } else {
      useStore.setState({ darkMode: true });
    }
  }
  const { data: session } = useSession();

  useEffect(() => {
    let run = true;
    if (run) {
      if (accessLevel !== "dev") {
        useStore.setState({ darkMode: false });
      } else {
        useStore.setState({ darkMode: true });
      }
    }
    return () => {
      run = false;
    };
  }, [session, accessLevel]);

  if (process.env.NODE_ENV !== "production")
    return (
      <button
        className="p-2 w-fit h-fit bg-white dark:bg-black transition text-black dark:text-white hover:bg-black hover:dark:bg-white focus:bg-black focus:dark:bg-white hover:text-white hover:dark:text-black focus:text-white focus:dark:text-black border-black dark:border-white rounded text-base"
        type="button"
        onClick={switchAccessLevel}
      >
        {accessLevel}
      </button>
    );
  if (session && session.user) {
    return (
      <div className="flex gap-2 flex-wrap items-center">
        {/* <p className="p-0 m-0 text-black dark:text-white">
                    {session.user.email
                        ?.split('@')[0]
                        .split('.')
                        .map((name) => name[0].toUpperCase() + name.slice(1))
                        .join(' ') ||
                        session.user.email?.split('@')[0] ||
                        session.user.email}
                </p> */}
        <button
          className="p-2 w-fit h-fit bg-white dark:bg-black transition text-black dark:text-white hover:bg-black hover:dark:bg-white focus:bg-black focus:dark:bg-white hover:text-white hover:dark:text-black focus:text-white focus:dark:text-black border-black dark:border-white rounded text-base"
          type="button"
          onClick={() => signOut()}
        >
          {" "}
          Log Out
        </button>
      </div>
    );
  }
  return (
    <button
      className="p-2 w-fit h-fit bg-white dark:bg-black transition text-black dark:text-white hover:bg-black hover:dark:bg-white focus:bg-black focus:dark:bg-white hover:text-white hover:dark:text-black focus:text-white focus:dark:text-black border-black dark:border-white rounded text-base"
      type="button"
      onClick={() => signIn()}
    >
      Log In
    </button>
  );
}
