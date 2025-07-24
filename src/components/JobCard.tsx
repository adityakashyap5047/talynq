"use client";

import React, { use, useState } from 'react'
import { Job } from '@/types';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import axios from 'axios';

interface JobCardProps {
  job: Job;
  isMyJob?: boolean;
}

const JobCard = ({ job, isMyJob = false, }: JobCardProps) => {
    
    const {user} = useUser();
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSavedJobClick = async (jobId: string) => {
        const previousSaved = saved;
        const newSaved = !saved;
        setSaved(newSaved);

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post('/api/jobs/saved', { jobId });

            if ((response.status === 201 && !newSaved) || (response.status === 200 && newSaved)) {
                
                setError("Server state mismatch. Please try again.");
            }

        } catch (error) {
            console.error("Error saving job:", error);
            setSaved(previousSaved);
            setError("Failed to save job");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Card className='flex flex-col'>
            <CardHeader>
                <CardTitle className='flex justify-between font-bold'>
                    {job.title}
                    {isMyJob && (
                        <Trash2Icon
                        fill='red'
                        size={18}
                        className='text-red-300 cursor-pointer'
                        />
                    )}
                </CardTitle>
            </CardHeader>

            <CardContent className='flex flex-col gap-4 flex-1'>
                <div className='flex justify-between'>
                    {job.company && <Image src={job.company.logo_url} alt={job.company.name} width={100} height={100} className='h-6' />}
                    <div className='flex gap-2 items-center'>
                        <MapPinIcon size={15} /> {job.location}    
                    </div>    
                </div>
                <hr />
                {job?.description?.substring(0, job.description.indexOf(".")) || job.description}...
            </CardContent>
            <CardFooter className='flex gap-2'>
                <Link href={`/jobs/${job.id}`} className='flex-1'>
                    <Button variant={"secondary"} className='w-full'>
                        More Details
                    </Button>
                </Link>

                {!isMyJob && user && (
                    <Button 
                        variant={"outline"}
                        className='w-15'
                        onClick={() => handleSavedJobClick(job.id)}
                        disabled={loading}
                    >
                        {saved ? (
                            <Heart size={20} stroke='red' fill='red' className='cursor-pointer' />
                        ) : (
                            <Heart size={20} className='cursor-pointer' />
                        )}
                    </Button>
                )}
            </CardFooter>
            {error && (
                <div className='text-red-500 mx-4 bg-slate-800 p-2 rounded-sm'>
                    {error}
                </div>
            )}
        </Card>
    )
}

export default JobCard