"use client";

import React from 'react'
import { Job } from '@/types';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';

interface JobCardProps {
  job: Job;
  isMyJob?: boolean;
  savedInIt?: boolean;
  onJobAction?: (action: 'save' | 'unsave') => void;
}

const JobCard = ({ job, isMyJob = false, savedInIt = false, onJobAction = () => {} }: JobCardProps) => {
    
    const {user} = useUser();

    return (
        <Card>
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
                {job.description.substring(0, job.description.indexOf(".")) || job.description}...
            </CardContent>
            <CardFooter className='flex gap-2'>
                <Link href={`/jobs/${job.id}`} className='flex-1'>
                    <Button variant={"secondary"} className='w-full'>
                        More Details
                    </Button>
                </Link>

                <Heart size={20} stroke='red' fill='red' className='cursor-pointer' />
            </CardFooter>
        </Card>
    )
}

export default JobCard