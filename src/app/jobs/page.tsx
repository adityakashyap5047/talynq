"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners';
import { Job } from '@/types';
import JobCard from '@/components/JobCard';

const JobListing = () => {

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [companyId, setCompanyId] = useState<string>('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.post('/api/jobs', {
          location: location,
          company_id: companyId,
          searchQuery: searchQuery,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status !== 200) {
          throw new Error('Failed to fetch jobs');
        }

        const data = response.data;
        setJobs(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        setJobs([]);
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [location, companyId, searchQuery]);

  if (!loading && error) {
    return <div className="text-red-500 bg-slate-800 p-4 rounded-sm">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>
        Latest Jobs
      </h1>
      {loading ? <BarLoader className="mt-4" width={"100%"} color="#36d7b7" /> : (
        <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-0'>
          {jobs?.length > 0 ? (
            jobs.map((job) => {
              return <JobCard key={job.id} job={job} />
            })
          ) : (
            <div>No Jobs Found 😥</div>
          )}
        </div>
      )}
    </div>
  )
}

export default JobListing