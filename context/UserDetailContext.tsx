"use client";

import { UserData } from "@/lib/types";
import { createContext, Dispatch, SetStateAction } from "react";

export type UserDetailContextType = {
  userData: UserData | null;
  setUserData: Dispatch<SetStateAction<UserData | null>>;
  loading?:boolean;
};

export const UserDetailContext =
  createContext<UserDetailContextType | null>(null);