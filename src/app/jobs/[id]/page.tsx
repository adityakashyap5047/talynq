"use client";

import { Job } from '@/types';
import axios from 'axios';
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners';
import MDEditor from '@uiw/react-md-editor';  

const JobPage = () => {

    const { id } = useParams();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchJob = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`/api/jobs/${id}`);
          setJob(response.data);
        } catch (error) {
          console.error("Error fetching job:", error);
          setError(error instanceof Error ? error.message : "Failed to fetch job");
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }, [id]);

    console.log("Job data:", job);

    if(loading) {
      return <BarLoader className='mb-4' width={"100%"} color='#1d293d ' />
    }

    if (error) {
      return <div className='text-red-500 bg-slate-800 p-4 rounded-sm mx-4 sm:mx-0'>Error: {error}</div>;
    }

  return (
    <div className='flex flex-col gap-8 mt-5 px-4'>
      <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
        <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'>{job?.title}</h1>
        <Image src={job?.company?.logo_url || '/talynq/talynq-icon.png'} className='h-12' height={100} width={100} alt={job?.company?.name || 'Company Logo'} />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {job?.location}
        </div>
        <div className='flex gap-2'>
          <Briefcase />
          {job?.applications?.length} Applicants
        </div>
        <div className='flex gap-2'>
          {job?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>
      <h2 className='text-2xl sm:text-3xl font-bold'>About the job</h2>
      <p className='sm:text-lg'>{job?.description}</p>

      <h2 className='text-2xl sm:text-3xl font-bold'>What we are looking for</h2>
      <MDEditor.Markdown 
        source={job?.requirements}
        className='!bg-transparent sm:text-lg'
      />
    </div>
  )
}

export default JobPage