"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  UserRound,
  AppWindow,
  Bot,
  Play,
  Blocks,
  Layers,
  Settings,
  User2,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

import { useTheme } from "@/context/ThemeContext";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";

const workspaceItems = [
  {
    label: "Dashboard",
    icon: AppWindow,
    route: "/dashboard",
    iconBg: "bg-blue-100",
    iconHoverBg: "hover:bg-blue-300",
    iconColor: "text-blue-900",
    iconCollapsedSize: "size-6",
  },
  {
    label: "Agents",
    icon: Bot,
    route: "/dashboard/agents",
    iconBg: "bg-green-100",
    iconHoverBg: "hover:bg-green-300",
    iconColor: "text-green-900",
    iconCollapsedSize: "size-7",
  },
  {
    label: "Runs",
    icon: Play,
    route: "/dashboard/play",
    iconBg: "bg-red-100",
    iconHoverBg: "hover:bg-red-300",
    iconColor: "text-red-900",
    iconCollapsedSize: "size-6",
  },
  {
    label: "Integrations",
    icon: Blocks,
    route: "/dashboard/tools",
    iconBg: "bg-orange-100",
    iconHoverBg: "hover:bg-orange-300",
    iconColor: "text-orange-900",
    iconCollapsedSize: "size-6",
  },
  {
    label: "Templates",
    icon: Layers,
    route: "/dashboard/templets",
    iconBg: "bg-purple-100",
    iconHoverBg: "hover:bg-purple-300",
    iconColor: "text-purple-900",
    iconCollapsedSize: "size-6",
  },
];

const userItems = [
  {
    label: "Settings",
    icon: Settings,
    route: "/dashboard/settings",
    iconBg: "bg-gray-100",
    iconHoverBg: "hover:bg-gray-300",
    iconColor: "text-gray-900",
    iconCollapsedSize: "size-6",
  },
  {
    label: "Profile",
    icon: User2,
    route: "/dashboard/profile",
    iconBg: "bg-yellow-100",
    iconHoverBg: "hover:bg-yellow-300",
    iconColor: "text-yellow-900",
    iconCollapsedSize: "size-6",
  },
];

interface DashboardNavbarProps {
  name?: string | null;
  email?: string | null;
  imageUrl?: string | null;
}

export default function DashboardNavbar({
  name,
  email,
  imageUrl,
}: DashboardNavbarProps) {
  const { signOut } = useClerk();
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const { theme, toggleTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  const navigate = (route: string) => {
    router.push(route);
    setSidebarOpen(false);
  };

  const isActive = (route: string) => {
    if (route === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(route);
  };

  const initials =
    name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

      const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut({ redirectUrl: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <header
        className="
          sticky top-0 z-50
          flex h-16 w-full items-center
          border-b border-gray-200
          bg-white/95
          px-3
          backdrop-blur-md
          transition-colors duration-300

          dark:border-[#302044]
          dark:bg-[#10051C]/95

          sm:px-5
          lg:px-7
        "
      >
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="
                size-9
                cursor-pointer
                text-gray-700
                transition-all duration-300
                hover:bg-purple-100
                hover:text-purple-700

                dark:text-purple-200
                dark:hover:bg-[#2A1245]
                dark:hover:text-purple-50

                md:hidden
              "
            >
              <Menu className="size-5" />
            </Button>

            <div
              className="
                flex cursor-pointer
                items-center gap-2
              "
              onClick={() => router.push("/dashboard")}
            >
              <div
                className="
                  flex size-9
                  items-center justify-center
                  rounded-xl
                  bg-purple-100
                  text-purple-700

                  dark:bg-[#2A1245]
                  dark:text-purple-300
                "
              >
                <Image src="/logo.svg" alt="logo" height={40} width={40} />
              </div>

              <div className="hidden sm:block">
                <h1
                  className="
                    text-sm font-bold
                    text-gray-900
                    dark:text-purple-50
                  "
                >
                  Nexora AI
                </h1>

                <p
                  className="
                    text-[11px]
                    text-gray-500
                    dark:text-purple-300
                  "
                >
                  AI Workspace
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="
                size-9
                cursor-pointer
                rounded-xl
                text-gray-700
                transition-all duration-300

                hover:bg-purple-100
                hover:text-purple-700

                dark:text-purple-200
                dark:hover:bg-[#2A1245]
                dark:hover:text-purple-50
              "
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="size-5 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="size-5 transition-transform duration-300 hover:-rotate-12" />
              )}
            </Button>

            <div className="relative">
              {/* Profile Trigger */}
              <div
                className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setPopupOpen((prev) => !prev)}
              >
                <div className="flex items-center gap-2 rounded-xl px-1.5 py-1 sm:px-2 dark:bg-[#170D29]/60">
                  <Avatar className="size-9">
                    <AvatarImage src={imageUrl || ""} alt={name || "User"} />

                    <AvatarFallback className="bg-purple-100 font-semibold text-purple-700 dark:bg-[#2A1245] dark:text-purple-100">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="hidden max-w-45 sm:block">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-purple-50">
                      {name || "User"}
                    </p>

                    <p className="truncate text-xs text-gray-500 dark:text-purple-300">
                      {email || "user@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Outside Click Overlay */}
              <div
                onClick={() => setPopupOpen(false)}
                className={`fixed inset-0 z-40 transition-opacity duration-200 ${
                  popupOpen
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              />

              {/* Profile Popup */}
              <div
                className={`absolute right-0 top-full z-50 mt-3 w-72 max-w-[calc(100vw-2rem)]
      overflow-hidden rounded-2xl border border-purple-500/20
      bg-[#100A1F] p-4 shadow-2xl shadow-black/40
      origin-top-right transition-all duration-200 ease-out
      ${
        popupOpen
          ? "visible translate-y-0 scale-100 opacity-100"
          : "invisible -translate-y-2 scale-95 opacity-0"
      }`}
              >
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 shrink-0">
                    <AvatarImage src={imageUrl || ""} alt={name || "User"} />

                    <AvatarFallback className="bg-[#2A1245] font-semibold text-purple-100">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {name || "User"}
                    </p>

                    <p className="truncate text-xs text-purple-300">
                      {email || "user@example.com"}
                    </p>
                  </div>
                </div>

                <div className="my-4 h-px bg-purple-500/20" />

                {/* Account */}
                <button
                  type="button"
                  onClick={() => {setPopupOpen(false); navigate("/dashboard/profile")}}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-purple-200 transition-colors duration-200 hover:bg-purple-500/10"
                >
                  <UserRound className="size-4 text-purple-400" />
                  My Account
                </button>

                {/* Logout */}
                <button
                  type="button"
                  onClick={() => {
                    setPopupOpen(false);
                    handleLogout();
                  }}
                  className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          data-theme={theme}
          className="
            w-[280px]
            border-r
            border-gray-200
            bg-white
            p-0
            text-gray-900
            shadow-2xl

            transition-colors duration-300

            dark:border-[#432663]
            dark:bg-[#10051C]
            dark:text-purple-50

            sm:w-[320px]
          "
        >
          <SheetHeader
            className="
              border-b
              border-gray-200
              px-5 py-4
              text-left

              dark:border-[#302044]
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={imageUrl || ""} alt={name || "User"} />

                  <AvatarFallback
                    className="
                      bg-purple-100
                      font-semibold
                      text-purple-700

                      dark:bg-[#2A1245]
                      dark:text-purple-100
                    "
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <SheetTitle
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-gray-900

                      dark:text-purple-50
                    "
                  >
                    {name || "User"}
                  </SheetTitle>

                  <p
                    className="
                      max-w-45
                      truncate
                      text-xs
                      text-gray-500

                      dark:text-purple-300
                    "
                  >
                    {email || "user@example.com"}
                  </p>
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="flex h-[calc(100vh-81px)] flex-col">
            <div className="flex-1 overflow-y-auto px-3 py-5">
              <p
                className="
                  mb-2
                  px-3
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-gray-400

                  dark:text-purple-400
                "
              >
                Workspace
              </p>

              <nav className="space-y-1">
                {workspaceItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.route);

                  return (
                    <button
                      key={item.route}
                      type="button"
                      onClick={() => navigate(item.route)}
                      className={`
                        group
                        flex w-full
                        items-center gap-3
                        rounded-xl
                        px-3 py-2.5
                        text-left
                        transition-all duration-300

                        ${
                          active
                            ? `
                              bg-purple-100
                              text-purple-700
                              shadow-sm

                              dark:bg-[#3B1761]
                              dark:text-purple-50
                            `
                            : `
                              text-gray-700
                              hover:bg-gray-100
                              hover:text-gray-900

                              dark:text-purple-200
                              dark:hover:bg-[#2A1245]
                              dark:hover:text-purple-50
                            `
                        }
                      `}
                    >
                      <div
                        className={`
                          flex
                          size-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          transition-all duration-300

                          ${item.iconBg}
                          ${item.iconHoverBg}

                          dark:bg-[#24103D]

                          ${active ? "dark:bg-[#6D28D9]" : ""}
                        `}
                      >
                        <Icon
                          className={`
                            ${item.iconCollapsedSize}
                            ${item.iconColor}

                            transition-transform
                            duration-300

                            group-hover:scale-110

                            dark:text-purple-200

                            ${active ? "dark:text-white" : ""}
                          `}
                        />
                      </div>

                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <Separator
                className="
                  my-5
                  bg-gray-200

                  dark:bg-[#302044]
                "
              />

              {/* ACCOUNT */}
              <p
                className="
                  mb-2
                  px-3
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-gray-400

                  dark:text-purple-400
                "
              >
                Account
              </p>

              <nav className="space-y-1">
                {userItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.route);

                  return (
                    <button
                      key={item.route}
                      type="button"
                      onClick={() => navigate(item.route)}
                      className={`
                        group
                        flex w-full
                        items-center gap-3
                        rounded-xl
                        px-3 py-2.5
                        text-left
                        transition-all duration-300

                        ${
                          active
                            ? `
                              bg-purple-100
                              text-purple-700

                              dark:bg-[#3B1761]
                              dark:text-purple-50
                            `
                            : `
                              text-gray-700
                              hover:bg-gray-100
                              hover:text-gray-900

                              dark:text-purple-200
                              dark:hover:bg-[#2A1245]
                              dark:hover:text-purple-50
                            `
                        }
                      `}
                    >
                      <div
                        className={`
                          flex size-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          ${item.iconBg}

                          transition-all duration-300

                          group-hover:scale-105

                          dark:bg-[#24103D]

                          ${active ? "dark:bg-[#6D28D9]" : ""}
                        `}
                      >
                        <Icon
                          className={`
                            ${item.iconCollapsedSize}
                            ${item.iconColor}

                            dark:text-purple-200

                            ${active ? "dark:text-white" : ""}
                          `}
                        />
                      </div>

                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div
              className="
                border-t
                border-gray-200
                p-3

                dark:border-[#302044]
                pb-5
              "
            >
              <Button
                variant="ghost"
                className="
                  w-full
                  justify-start
                  gap-3
                  text-gray-700

                  hover:bg-red-50
                  hover:text-red-600

                  dark:text-purple-200
                  dark:hover:bg-red-950/40
                  dark:hover:text-red-400
                "
                onClick={() => {
                  handleLogout();
                }}
              >
                <LogOut className="size-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
