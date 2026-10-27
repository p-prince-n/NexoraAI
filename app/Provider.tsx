"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import { UserData } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Provider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
 const [userData, setUserData] = useState<UserData | null>(null);
 const [loading, setLoading]=useState<boolean>(true);

  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      createNewUser();
    }
  }, [isLoaded, isSignedIn]);

  const createNewUser = async () => {
    setLoading(true)
    try {
      const result = await axios.post("/api/users");

      console.log(result.data);

      setUserData(result.data.data);
    } catch (error) {
      console.error("Failed to create/sync user:", error);
    }finally{
      setLoading(false)
    }
  };

  return (
    <UserDetailContext.Provider value={{ userData, setUserData, loading }}>
      {children}
    </UserDetailContext.Provider>
  );
};

export default Provider;


