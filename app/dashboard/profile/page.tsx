"use client";

import { useContext } from "react";
import { CalendarDays, Mail, User, Bot, Zap, Clock3 } from "lucide-react";
import { UserDetailContext } from "@/context/UserDetailContext";

const ProfilePage = () => {
  const context = useContext(UserDetailContext);

  if (!context) {
    throw new Error("UserPage must be used inside UserDetailContext.Provider");
  }

  const { userData } = context;

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-gray-500 dark:text-gray-400">Loading user...</div>
      </div>
    );
  }

  const createdAt = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <main
      className="
    min-h-screen w-full
    px-4 py-6
    transition-colors duration-300
    
    sm:px-6
    lg:px-10
  "
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="
          text-2xl font-bold tracking-tight
          text-gray-900
          dark:text-purple-50
          sm:text-3xl
        "
          >
            My Profile
          </h1>

          <p
            className="
          mt-1 text-sm
          text-gray-500
          dark:text-purple-300
        "
          >
            Manage your account information and usage
          </p>
        </div>

        {/* Profile Card */}
        <section
          className="
        overflow-hidden rounded-2xl
        border border-gray-200
        bg-white
        shadow-sm
        transition-colors duration-300

        dark:border-[#432663]
        dark:bg-[#1A0B2E]
        dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)]
      "
        >
          {/* Gradient Banner */}
          <div
            className="
          h-28
          bg-gradient-to-r
          from-blue-500 via-purple-500 to-pink-500
          sm:h-36
        "
          />

          {/* Profile Information */}
          <div className="px-5 pb-6 sm:px-8">
            <div
              className="
            -mt-12 flex flex-col gap-5
            sm:-mt-16
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
            >
              <div
                className="
              flex flex-col items-start gap-4
              sm:flex-row
              sm:items-end
            "
              >
                {/* Profile Image */}
                <div
                  className="
                rounded-full
                border-4 border-white
                bg-gray-100
                shadow-lg
                transition-colors duration-300

                dark:border-[#1A0B2E]
                dark:bg-[#2A1245]
              "
                >
                  <img
                    src={userData.image || "/default-avatar.png"}
                    alt={userData.name || "User"}
                    className="
                  h-24 w-24 rounded-full object-cover
                  sm:h-32 sm:w-32
                "
                  />
                </div>

                {/* Name */}
                <div className="pb-1">
                  <h2
                    className="
                  text-xl font-bold
                  text-gray-900
                  dark:text-purple-50
                  sm:text-2xl
                "
                  >
                    {userData.name || "User"}
                  </h2>

                  <div
                    className="
                  mt-1 flex items-center gap-2
                  text-sm
                  text-gray-500
                  dark:text-purple-300
                "
                  >
                    <Mail className="h-4 w-4" />
                    <span className="break-all">{userData.email}</span>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div
                className="
              flex w-fit items-center gap-2
              rounded-full
              border border-green-200
              bg-green-50
              px-3 py-1.5
              text-sm font-medium
              text-green-700

              dark:border-green-800/60
              dark:bg-green-950/40
              dark:text-green-400
            "
              >
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Active Account
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section
          className="
        mt-6 grid grid-cols-1 gap-4
        sm:grid-cols-2
        lg:grid-cols-3
      "
        >
          {/* Agent Credits */}
          <div
            className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-5
          shadow-sm
          transition-all duration-300
          hover:-translate-y-1
          hover:shadow-md

          dark:border-[#432663]
          dark:bg-[#1A0B2E]
          dark:hover:border-[#6D28D9]
          dark:hover:bg-[#211038]
          dark:hover:shadow-[0_0_20px_rgba(109,40,217,0.18)]
        "
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="
                text-sm font-medium
                text-gray-500
                dark:text-purple-300
              "
                >
                  Agent Credits
                </p>

                <h3
                  className="
                mt-2 text-3xl font-bold
                text-gray-900
                dark:text-purple-50
              "
                >
                  {userData.agentCredits ?? 0}
                </h3>

                <p
                  className="
                mt-1 text-xs
                text-gray-500
                dark:text-purple-400
              "
                >
                  Available agent credits
                </p>
              </div>

              <div
                className="
              flex h-12 w-12 items-center justify-center
              rounded-xl
              bg-purple-100
              text-purple-600

              dark:bg-purple-500/15
              dark:text-purple-400
            "
              >
                <Bot className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Usage Credits */}
          <div
            className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-5
          shadow-sm
          transition-all duration-300
          hover:-translate-y-1
          hover:shadow-md

          dark:border-[#432663]
          dark:bg-[#1A0B2E]
          dark:hover:border-[#6D28D9]
          dark:hover:bg-[#211038]
          dark:hover:shadow-[0_0_20px_rgba(109,40,217,0.18)]
        "
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="
                text-sm font-medium
                text-gray-500
                dark:text-purple-300
              "
                >
                  Usage Credits
                </p>

                <h3
                  className="
                mt-2 text-3xl font-bold
                text-gray-900
                dark:text-purple-50
              "
                >
                  {userData.usageCredits ?? 0}
                </h3>

                <p
                  className="
                mt-1 text-xs
                text-gray-500
                dark:text-purple-400
              "
                >
                  Remaining usage credits
                </p>
              </div>

              <div
                className="
              flex h-12 w-12 items-center justify-center
              rounded-xl
              bg-blue-100
              text-blue-600

              dark:bg-blue-500/15
              dark:text-blue-400
            "
              >
                <Zap className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Member Since */}
          <div
            className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-5
          shadow-sm
          transition-all duration-300
          hover:-translate-y-1
          hover:shadow-md

          dark:border-[#432663]
          dark:bg-[#1A0B2E]
          dark:hover:border-[#6D28D9]
          dark:hover:bg-[#211038]
          dark:hover:shadow-[0_0_20px_rgba(109,40,217,0.18)]

          sm:col-span-2
          lg:col-span-1
        "
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="
                text-sm font-medium
                text-gray-500
                dark:text-purple-300
              "
                >
                  Member Since
                </p>

                <h3
                  className="
                mt-2 text-lg font-bold
                text-gray-900
                dark:text-purple-50
              "
                >
                  {createdAt}
                </h3>

                <p
                  className="
                mt-1 text-xs
                text-gray-500
                dark:text-purple-400
              "
                >
                  Account creation date
                </p>
              </div>

              <div
                className="
              flex h-12 w-12 items-center justify-center
              rounded-xl
              bg-orange-100
              text-orange-600

              dark:bg-orange-500/15
              dark:text-orange-400
            "
              >
                <CalendarDays className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        {/* Account Details */}
        <section
          className="
        mt-6 rounded-2xl
        border border-gray-200
        bg-white
        shadow-sm
        transition-colors duration-300

        dark:border-[#432663]
        dark:bg-[#1A0B2E]
        dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)]
      "
        >
          <div
            className="
          border-b border-gray-200
          px-5 py-4
          dark:border-[#432663]
          sm:px-6
        "
          >
            <h2
              className="
            text-lg font-semibold
            text-gray-900
            dark:text-purple-50
          "
            >
              Account Details
            </h2>

            <p
              className="
            mt-1 text-sm
            text-gray-500
            dark:text-purple-300
          "
            >
              Your basic account information
            </p>
          </div>

          <div
            className="
          divide-y divide-gray-100
          dark:divide-[#302044]
        "
          >
            {/* Name */}
            <div
              className="
            flex flex-col gap-2
            px-5 py-4
            transition-colors duration-300
            hover:bg-gray-50
            dark:hover:bg-[#211038]
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
          "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                flex h-9 w-9 items-center justify-center
                rounded-lg
                bg-gray-100

                dark:bg-[#2A1245]
              "
                >
                  <User
                    className="
                  h-4 w-4
                  text-gray-600
                  dark:text-purple-300
                "
                  />
                </div>

                <span
                  className="
                text-sm
                text-gray-500
                dark:text-purple-300
              "
                >
                  Full Name
                </span>
              </div>

              <span
                className="
              text-sm font-medium
              text-gray-900
              dark:text-purple-50
              sm:text-right
            "
              >
                {userData.name || "Not provided"}
              </span>
            </div>

            {/* Email */}
            <div
              className="
            flex flex-col gap-2
            px-5 py-4
            transition-colors duration-300
            hover:bg-gray-50
            dark:hover:bg-[#211038]
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
          "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                flex h-9 w-9 items-center justify-center
                rounded-lg
                bg-gray-100
                dark:bg-[#2A1245]
              "
                >
                  <Mail
                    className="
                  h-4 w-4
                  text-gray-600
                  dark:text-purple-300
                "
                  />
                </div>

                <span
                  className="
                text-sm
                text-gray-500
                dark:text-purple-300
              "
                >
                  Email Address
                </span>
              </div>

              <span
                className="
              break-all text-sm font-medium
              text-gray-900
              dark:text-purple-50
              sm:text-right
            "
              >
                {userData.email}
              </span>
            </div>

            {/* Created At */}
            <div
              className="
            flex flex-col gap-2
            px-5 py-4
            transition-colors duration-300
            hover:bg-gray-50
            dark:hover:bg-[#211038]
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
          "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                flex h-9 w-9 items-center justify-center
                rounded-lg
                bg-gray-100
                dark:bg-[#2A1245]
              "
                >
                  <Clock3
                    className="
                  h-4 w-4
                  text-gray-600
                  dark:text-purple-300
                "
                  />
                </div>

                <span
                  className="
                text-sm
                text-gray-500
                dark:text-purple-300
              "
                >
                  Created At
                </span>
              </div>

              <span
                className="
              text-sm font-medium
              text-gray-900
              dark:text-purple-50
              sm:text-right
            "
              >
                {createdAt}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
