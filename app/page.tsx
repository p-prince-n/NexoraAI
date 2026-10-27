"use client";
import { useTheme } from "@/context/ThemeContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useContext } from "react";

export default function Home() {
  const context = useContext(UserDetailContext);
  if (!context?.loading && !context?.userData) {
    return (
      <div>
        <h1>Hello World</h1>
        <UserButton />
      </div>
    );
  }
  if (!context?.loading && context?.userData) return redirect("/dashboard");
  const theme=useTheme()

  return (
    <div data-theme={theme.theme} className="flex items-center justify-center h-screen w-full overflow-y-scroll bg-white dark:bg-[#10051C] ">
      <Loader2 className="size-10 animate-spin" />
    </div>
  );
}
