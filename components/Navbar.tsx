"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  isScrolled: boolean;
};

const Navbar = ({ isScrolled }: Props) => {
  const router = useRouter();
  const navigate = (url: string) => {
    router.push(url);
  };
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = ["agents", "workflow", "integrations", "home"];

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        root: document.querySelector("#scroll-container"),
        threshold: [0.2, 0.4, 0.6],
      },
    );

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const getLinkClass = (section: string) =>
    `px-3 py-2 font-medium text-sm md:text-lg rounded-lg
   transition-all duration-300
   ${
     activeSection === section
       ? "text-white bg-purple-400 dark:bg-purple-600/30 border border-purple-400/30 shadow-md shadow-purple-500/10"
       : "text-black dark:text-purple-300 hover:text-white hover:bg-purple-400  hover:dark:bg-purple-500/10"
   }`;

  return (
    <nav
      className={`
    w-full
    bg-black/10
    dark:bg-[#241333]/80
    backdrop-blur-xl
    border border-white/10
    transition-all duration-500 ease-in-out
    px-2 md:px-5
    ${
      isScrolled
        ? "rounded-none py-2"
        : "max-w-7xl w-[90%] rounded-none md:rounded-2xl py-2 md:py-3 mt-5"
    }
  `}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/logo.svg"
            height={40}
            width={40}
            alt="logo"
            className="border border-purple-500 shadow-lg hover:scale-105 transition-all duration-500 cursor-pointer rounded-xl"
          />

          <h1 className="text-lg md:text-xl xl:text-2xl dark:text-purple-300 font-semibold">
            Nexora AI
          </h1>
        </div>

        {/* Navigation links */}
        <div className="hidden sm:flex items-center gap-1 md:gap-4">
          <Link href="/#agents" className={getLinkClass("agents")}>
            Agents
          </Link>

          <Link href="/#workflow" className={getLinkClass("workflow")}>
            Workflow
          </Link>

          <Link href="/#integrations" className={getLinkClass("integrations")}>
            Integrations
          </Link>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          type="button"
          className="flex items-center justify-center px-2 md:px-3 py-1 md:py-2 bg-purple-600 dark:bg-purple-900 dark:text-purple-300 text-white hover:scale-110 hover:border border-purple-500 transition-all duration-500 text-sm md:text-base font-semibold rounded-md md:rounded-xl shrink-0 gap-1 md:gap-3 cursor-pointer"
        >
          Open Dashboard
          <ArrowRight className="size-4 md:size-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
