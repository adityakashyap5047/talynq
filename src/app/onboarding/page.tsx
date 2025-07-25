"use client";

import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useLayoutEffect } from 'react';
import { BarLoader } from "react-spinners";

type RoleType = "candidate" | "recruiter";

const Onboarding = () => {

  const { user, isLoaded } = useUser();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!isLoaded || !user) return;

    const addUser = async () => {
      await axios.post('/api/add-user');
    }
    addUser();

    if (user?.unsafeMetadata?.role) {
      if (user?.unsafeMetadata.role === "recruiter") {
        router.replace("/post-job");
      } else if (user?.unsafeMetadata?.role === "candidate") {
        router.replace("/jobs");
      }
    }
  }, [user, isLoaded, router])

  const handleRoleSelection: (role: RoleType) => void = async (role) => {
    const updateUser = await user?.update({
      unsafeMetadata: {role},
    })

    if (updateUser && role === "recruiter") {
      router.push("/post-job");
    } else if (updateUser && role === "candidate") {
      router.push("/jobs");
    } else {
      router.push("/");
    }
  };

  if (!isLoaded || user?.unsafeMetadata?.role) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
  }

  return (
    <div className='flex flex-col items-center justify-center mt-40 px-4'>
      <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter'>
        I am a...
      </h2>
      <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
        <Button 
          variant={"blue"} 
          className='h-36 text-2xl'
          onClick={() => handleRoleSelection("candidate")}
        >Candidate</Button>
        <Button 
          variant={"destructive"} 
          className='h-36 text-2xl'
          onClick={() => handleRoleSelection("recruiter")}
        >Recruiter</Button>
      </div>
    </div>
  )
}

export default Onboarding