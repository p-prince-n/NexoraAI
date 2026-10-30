"use client";
import AgentLandingPage from "@/components/AgentLandingPage";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { useTheme } from "@/context/ThemeContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

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
  const theme = useTheme();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
   <div
  data-theme={theme.theme}
  className="flex h-screen w-full flex-col overflow-hidden bg-white dark:bg-[#10051C]"
>
  {/* Navbar */}
  <div className="sticky top-0 z-[100] flex w-full shrink-0 justify-center">
    <Navbar isScrolled={isScrolled} />
  </div>

  {/* Scrollable content */}
  <div
    className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
    onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
  >
    <div className="flex flex-col items-center pb-10 overscroll-none">
      <div className="flex lg:h-screen w-full items-center justify-center">
        <Hero isScrolled={isScrolled} />
      </div>

      <AgentLandingPage />
    </div>
  </div>
</div>
  );
}
