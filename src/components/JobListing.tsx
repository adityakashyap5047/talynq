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
import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const JobListing = () => {

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [companyId, setCompanyId] = useState<string>('');

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1');
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const limit = 6;
  const totalPages = Math.ceil(totalJobs / limit);

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

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>
        Latest Jobs
      </h1>

      <form onSubmit={handleSearch} className='px-4 sm:px-0'>
        <div className='bg-slate-900 h-10 flex w-full gap-2 items-center mb-3'>
          <Input 
            type='text'
            placeholder='Search Jobs...'
            name='search-query'
            className='flex-1 px-4 text-md h-full'
          />
          <Button disabled={loading} type='submit' className='h-full sm:w-28' variant={"blue"}>Search</Button>
        </div>  
      </form>

      <div className='flex flex-col sm:flex-row gap-2'>
        <div className='flex-1 px-4 sm:px-0'>
          <Select value={location} onValueChange={(value) => setLocation(value)}>
            <SelectTrigger className='w-full !bg-slate-900 cursor-pointer'>
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>
            <SelectContent className='bg-slate-900'>
              <SelectGroup>
                {State.getStatesOfCountry("IN").map(({name}) => {
                  return (
                    <SelectItem className="cursor-pointer data-[highlighted]:bg-slate-800" key={name} value={name}>{name}</SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex-1 px-4 sm:px-0'>
          <Select disabled={isLoadingCompanies} value={companyId} onValueChange={(value) => setCompanyId(value)}>
            <SelectTrigger className='w-full !bg-slate-900 cursor-pointer'>
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent className='bg-slate-900'>
              <SelectGroup>
                {companies.map(({name, id}) => {
                  return (
                    <SelectItem className="cursor-pointer data-[highlighted]:bg-slate-800" key={name} value={id}>{name}</SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

        </div>
        <Button onClick={clearFilters} className='mx-4 bg-red-500 hover:bg-red-500/50 text-white sm:mx-0 sm:w-1/2'>Clear Filters</Button>
      </div>

      {loading ? <BarLoader className="mt-4" width={"100%"} color="#36d7b7" /> : (
        <>
          <div className='my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-0'>
            {jobs?.length > 0 ? (
              jobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div>No Jobs Found 😥</div>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={currentPage === pageNum}
                        onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}

export default JobListing