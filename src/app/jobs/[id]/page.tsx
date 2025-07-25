"use client";

import { Job } from '@/types';
import axios from 'axios';
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { BarLoader } from 'react-spinners';
import MDEditor from '@uiw/react-md-editor';  
import { useUser } from '@clerk/nextjs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ApplyJob from '@/components/ApplyJob';
import ApplicationCard from '@/components/ApplicationCard';

const JobPage = () => {

    const { id } = useParams();
    const { user } = useUser();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isLoadingJobStatus, setIsLoadingJobStatus] = useState<boolean>(false);
    const userId = useRef<string | null>(null);
    
    useEffect(() => {
      const fetchJob = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`/api/jobs/${id}`);
          setJob(response.data.job);
          userId.current = response.data.userId;
        } catch (error) {
          console.error("Error fetching job:", error);
          setError(error instanceof Error ? error.message : "Failed to fetch job");
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }, [id, user?.id]);

    const handleStatusChange = (value: "open" | "closed") => {
      setIsLoadingJobStatus(true);
      setError(null);
      const isOpen = value === "open";
      const fetchStatus = async () => {
        try {
          await axios.post(`/api/jobs/${id}`, {status: isOpen});
          const response = await axios.get(`/api/jobs/${id}`);
          setJob(response.data.job);
        } catch (error) {
          console.error("Error fetching job:", error);
          setError(error instanceof Error ? error.message : "Failed to fetch job");
        } finally {
          setIsLoadingJobStatus(false);
        }
      }
      fetchStatus();
    }

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

      {isLoadingJobStatus && <BarLoader width={"100%"} color='#1d293d' />}
      {job?.recruiter?.clerkUserId === user?.id && (
        <Select disabled={isLoadingJobStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className={`w-full cursor-pointer ${job?.isOpen ? "!bg-green-900" : "!bg-red-900"}`}>
            <SelectValue placeholder={"Hiring Status" + (job?.isOpen ? " (Open)" : " (Closed)") } />
          </SelectTrigger>
          <SelectContent className='bg-slate-900'>
            <SelectItem className="cursor-pointer data-[highlighted]:bg-slate-800" value={'open'}>{'open'}</SelectItem>
            <SelectItem className="cursor-pointer data-[highlighted]:bg-slate-800" value={'closed'}>{'closed'}</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className='text-2xl sm:text-3xl font-bold'>About the job</h2>
      <p className='sm:text-lg'>{job?.description}</p>

      <h2 className='text-2xl sm:text-3xl font-bold'>What we are looking for</h2>
      <MDEditor.Markdown 
        source={job?.requirements}
        className='!bg-transparent sm:text-lg'
      />

      {job?.recruiter?.clerkUserId !== user?.id && (
        <ApplyJob 
          job={job}
          applied={!!job?.applications?.find((ap) => ap.candidate_id === userId.current)}
          setJob={setJob}
        />
      )}

      {job && job?.applications?.length > 0 && job?.recruiter_id === userId.current && (
        <div className='flex flex-col gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold text-[#1154c7]'>Applications</h2>
          {job?.applications.map((application) => {
            return <ApplicationCard key={application.id} application={application} />
          })}
        </div>
      )}
    </div>
  )
}

export default JobPage