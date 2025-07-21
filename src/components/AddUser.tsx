"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { addUserToDB } from "@/lib/addUserToDB"

const AddUser = () => {
  const { isSignedIn } = useUser();

  useEffect(() => {
    const addUser = async () => {
      if (isSignedIn) {
        await addUserToDB();
      }
    };
    addUser();
  }, [isSignedIn]);

  return null;
};

export default AddUser;