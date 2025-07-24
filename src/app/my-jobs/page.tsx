"use client";

import AppliedApplications from '@/components/AppliedApplications';
import CreatedJobs from '@/components/CreatedJobs';
import { useUser } from '@clerk/nextjs';
import React from 'react'
import { BarLoader } from 'react-spinners';

const MyJobs = () => {

  const {user, isLoaded} = useUser();

  if (!isLoaded) {
    return <BarLoader width={"100%"} color="#3b82f6" className='mx-auto my-8' />
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>
        {user?.unsafeMetadata?.role === 'candidate' ? "My Application" : "My Job"}
      </h1>
      {
        user?.unsafeMetadata?.role === 'candidate' ? <AppliedApplications /> : <CreatedJobs />
      }
    </div>
  )
}

export default MyJobs;