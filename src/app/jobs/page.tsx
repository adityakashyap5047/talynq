"use client";

import { Suspense } from "react";
import JobListing from "@/components/JobListing";
import { HashLoader } from "react-spinners";

export default function Jobs() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-[200px]"><HashLoader color="#3b82f6" speedMultiplier={1.7} size={60} className='mx-auto my-8' /></div>}>
      <JobListing />
    </Suspense>
  );
}