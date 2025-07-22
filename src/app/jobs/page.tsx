"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners';
import { Company, Job } from '@/types';
import JobCard from '@/components/JobCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { State } from "country-state-city";

const JobListing = () => {

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [companyId, setCompanyId] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const limit = 3;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post('/api/jobs', {
          location,
          company_id: companyId,
          searchQuery,
          page: currentPage,
          limit,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status !== 200) {
          throw new Error('Failed to fetch jobs');
        }

        const {jobs: jobData, total} = response.data;
        setJobs(jobData);
        setTotalJobs(total);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        setJobs([]);
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [location, companyId, searchQuery, currentPage]);

  useEffect(() => {
    const getCompanies = async () => {
      setIsLoadingCompanies(true);
      setError(null);
      try {
        const response = await axios.get('/api/companies');

        if (response.status !== 200) {
          throw new Error('Failed to fetch companies');
        }

        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred while fetching companies');
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    getCompanies();
  }, []);

  const totalPages = Math.ceil(totalJobs / limit);

  if (!loading && error) {
    return <div className="text-red-500 bg-slate-800 p-4 rounded-sm">Error: {error}</div>;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const query = formData.get('search-query') as string;
    if (query) setSearchQuery(query.trim());
  };

  const clearFilters = () => {
    setLocation('');
    setCompanyId('');
    setSearchQuery('');
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>
        Latest Jobs
      </h1>

      <form onSubmit={handleSearch} className='h-10 flex w-full gap-2 items-center mb-3 px-4 sm:px-0'>
        <Input 
          type='text'
          placeholder='Search Jobs...'
          name='search-query'
          className='flex-1 px-4 text-md h-full'
        />
        <Button disabled={loading} type='submit' className='h-full sm:w-28' variant={"blue"}>Search</Button>
      </form>

      <div className='flex flex-col sm:flex-row gap-2'>
        <div className='flex-1 px-4 sm:px-0'>
          <Select value={location} onValueChange={(value) => setLocation(value)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {State.getStatesOfCountry("IN").map(({name}) => {
                  return (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex-1 px-4 sm:px-0'>
          <Select disabled={isLoadingCompanies} value={companyId} onValueChange={(value) => setCompanyId(value)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {companies.map(({name, id}) => {
                  return (
                    <SelectItem key={name} value={id}>{name}</SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

        </div>
        <Button onClick={clearFilters} variant={"destructive"} className='mx-4 sm:mx-0 sm:w-1/2'>Clear Filters</Button>
      </div>

      {loading ? <BarLoader className="mt-4" width={"100%"} color="#36d7b7" /> : (
        <>
    {/* Job Cards Grid */}
    <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-0'>
      {jobs?.length > 0 ? (
        jobs.map((job) => <JobCard key={job.id} job={job} />)
      ) : (
        <div>No Jobs Found 😥</div>
      )}
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="flex justify-center mt-6 gap-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <span className="self-center">Page {currentPage} of {totalPages}</span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    )}
  </>
      )}
    </div>
  )
}

export default JobListing