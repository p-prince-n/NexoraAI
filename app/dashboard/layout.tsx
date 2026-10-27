"use client";
import DashboardNavbar from "@/components/custom/DashboardNavbar";
import AppSidebar from "@/components/custom/Sidebar/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar";
import { useTheme } from "@/context/ThemeContext";
import { UserDetailContext } from "@/context/UserDetailContext";

import { useContext, useState } from "react";

const dashboardlayout = ({ children }: any) => {
   const context = useContext(UserDetailContext);

  if (!context) {
    throw new Error("UserPage must be used inside UserDetailContext.Provider");
  }

  const { userData } = context;
  const [open, setOpen] = useState(false);
    const theme=useTheme();
  return (
  <SidebarProvider
  open={open}
  onOpenChange={setOpen}
  className="min-h-screen"
>
  <AppSidebar />

  <main
    data-theme={theme.theme}
    className="
      flex-1
      w-full
      min-h-0
      h-screen
      overflow-auto
      bg-white
      text-gray-900
      transition-colors duration-300

      dark:bg-[#10051C]
      dark:text-purple-50
    "
  >
    <DashboardNavbar name={userData?.name} imageUrl={userData?.image} email={userData?.email} />

    {children}
  </main>
</SidebarProvider>
  );
};

export default dashboardlayout;
