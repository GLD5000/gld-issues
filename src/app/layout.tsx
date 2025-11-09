import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LayoutClient from "./LayoutClient";
import Providers from "@/auth/Providers";
import { showLoginPage } from "@/auth/auth";

const inter = Inter({ subsets: ["latin"] });
//<link rel="stylesheet" href="https://use.typekit.net/ikx5mmg.css">
export const metadata: Metadata = {
  title: "GLD Issues UI",
  description: "An interface for your GitHub Issues or task management",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessLevel } = await showLoginPage();
  return (
    <html lang="en" className={`scroll-smooth w-full`}>
      <body className={`${inter.className} scroll-smooth w-full bg-black`}>
        <Providers>
          <LayoutClient accessLevel={accessLevel}>{children}</LayoutClient>
        </Providers>
      </body>
    </html>
  );
}
