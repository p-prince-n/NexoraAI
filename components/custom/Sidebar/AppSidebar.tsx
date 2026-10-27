"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import React from "react";

import {
  AppWindow,
  Blocks,
  Bot,
  Layers,
  Play,
  Settings,
  User2,
} from "lucide-react";

import Image from "next/image";
import { usePathname } from "next/navigation";
import SideBarFooter from "./SideBarFooter";

import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

function SidebarNavItem({
  label,
  icon: Icon,
  route,
  iconBg,
  iconHoverBg,
  iconColor,
  iconCollapsedSize = "size-6",
  collapsedExtra = "",
  path,
}: {
  label: string;
  icon: React.ElementType;
  route: string;
  iconBg: string;
  iconHoverBg: string;
  iconColor: string;
  iconCollapsedSize?: string;
  collapsedExtra?: string;
  path: string;
}) {
  const router = useRouter();

  const handleNavigation = () => {
    router.push(route);
  };

  return (
    <SidebarMenuButton
      tooltip={label}
      onClick={handleNavigation}
      className={`
    h-12 gap-3
    cursor-pointer
    mt-2

    text-slate-700
    hover:bg-purple-100
    hover:text-purple-700

    dark:text-purple-200
    dark:hover:bg-[#321451]
    dark:hover:text-purple-50

    ${
      path === route &&
      `
        cursor-not-allowed
        bg-purple-100
        text-purple-700

        dark:bg-[#6D28D9]
        dark:text-white
        dark:hover:bg-[#7C3AED]
        dark:hover:text-white
        dark:shadow-[0_0_15px_rgba(109,40,217,0.25)]

        hover:bg-purple-200
      `
    }

    group-data-[collapsible=icon]:!size-13
    group-data-[collapsible=icon]:!p-0
    group-data-[collapsible=icon]:!justify-center
    group-data-[collapsible=icon]:mx-auto

    transition-all
    duration-300
  `}
    >
      <div
        className={`
      ${iconBg}

      flex
      w-8
      h-9
      shrink-0
      items-center
      justify-center
      rounded-lg

      group-data-[collapsible=icon]:${iconHoverBg}
      group-data-[collapsible=icon]:size-10
      group-data-[collapsible=icon]:transition-colors
      group-data-[collapsible=icon]:duration-500
      group-data-[collapsible=icon]:cursor-pointer
      group-data-[collapsible=icon]:rounded-lg

      ${collapsedExtra}

      dark:bg-[#24103D]
      dark:text-purple-200

      group-hover:dark:bg-[#3B1761]

      ${
        path === route
          ? `
            dark:bg-[#7C3AED]
            dark:text-white
            dark:shadow-[0_0_10px_rgba(124,58,237,0.3)]
          `
          : ""
      }
    `}
      >
        <Icon
          className={`
        size-5

        group-data-[collapsible=icon]:${iconCollapsedSize}

        ${iconColor}

        dark:text-purple-300

        ${path === route ? "dark:text-white" : ""}
      `}
        />
      </div>

      <span
        className="
      group-data-[collapsible=icon]:hidden
    "
      >
        {label}
      </span>
    </SidebarMenuButton>
  );
}

const workspaceItems = [
  {
    label: "Dashboard",
    icon: AppWindow,
    route: "/dashboard",
    iconBg: "bg-blue-100  ",
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
    label: "Templets",
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
    iconBg: "bg-gray-100 ",
    iconHoverBg: "hover:bg-black/30",
    iconColor: "text-gray-900",
    iconCollapsedSize: "size-6",
    collapsedExtra:
      "",
  },
  {
    label: "Profile",
    icon: User2,
    route: "/dashboard/profile",
    iconBg: "bg-yellow-100",
    iconHoverBg: "hover:bg-yellow-300",
    iconColor: "text-yellow-900",
    iconCollapsedSize: "size-6",
    collapsedExtra: "",
  },
];

const AppSidebar = () => {
  const path = usePathname();
  const theme = useTheme();

  return (
    <Sidebar
      data-theme={theme.theme}
      collapsible="icon"
      className="
    border-gray-200
    bg-white
    transition-colors duration-300

    dark:border-[#302044]
    dark:bg-[#10051C]
  "
    >
      <SidebarHeader
        className="
      flex flex-row items-center justify-between
      border-b border-gray-200
      bg-white
      p-4
      transition-colors duration-300

      group-data-[state=collapsed]:flex-col
      group-data-[state=collapsed]:gap-3

      dark:border-[#302044]
      dark:bg-[#10051C]
    "
      >
        <div
          className="
        flex flex-row items-center gap-2.5

        group-data-[state=collapsed]:flex-col
        group-data-[state=collapsed]:gap-2
      "
        >
          <Image src="/logo.svg" alt="logo" height={40} width={40} />

          <h2
            className="
          text-lg
          font-semibold
          text-slate-900

          group-data-[state=collapsed]:hidden

          dark:text-purple-50
        "
          >
            Nexora AI
          </h2>
        </div>

        <SidebarTrigger
          className="
        cursor-pointer
        text-gray-600
        transition-all duration-300

        hover:bg-purple-100
        hover:text-purple-700

        dark:text-purple-300
        dark:hover:bg-[#2A1245]
        dark:hover:text-purple-50
      "
        />
      </SidebarHeader>

      <SidebarContent
        className="
      bg-white
      text-gray-700
      transition-colors duration-300

      dark:bg-[#10051C]
      dark:text-purple-200
    "
      >
        {/* Workspace */}
        <SidebarGroup
          className="
        group-data-[collapsible=icon]:gap-2
      "
        >
          <SidebarGroupLabel
            className="
          text-gray-500

          dark:text-purple-400
        "
          >
            Workspace
          </SidebarGroupLabel>

          {workspaceItems.map((item) => (
            <SidebarNavItem key={item.route} {...item} path={path} />
          ))}
        </SidebarGroup>

        {/* Users */}
        <SidebarGroup
          className="
        group-data-[collapsible=icon]:gap-2
      "
        >
          <SidebarGroupLabel
            className="
          text-gray-500

          dark:text-purple-400
        "
          >
            Users
          </SidebarGroupLabel>

          {userItems.map((item) => (
            <SidebarNavItem key={item.route} {...item} path={path} />
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SideBarFooter />
    </Sidebar>
  );
};
export default React.memo(AppSidebar);
