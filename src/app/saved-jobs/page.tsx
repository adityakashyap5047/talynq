"use client";

import JobCard from "@/components/JobCard";
import { SavedJob } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<SavedJob[]>([]);

  const [savedJobLoading, setSavedJobLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/jobs/saved');
        if(response.status === 200) {
          setJobs(response.data);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, []);

  if(loading) {
    return <BarLoader width={"100%"} color="#3b82f6" className='mx-auto my-8' />
  }

  if(error) {
    return <div className='text-red-500 bg-slate-800 p-4 mx-4 rounded-sm text-center mt-8'>{error}</div>
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>Saved Jobs</h1>
      {savedJobLoading && <BarLoader width={"100%"} color="#3b82f6" className='mx-auto my-8' />}
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs?.length ? (
          jobs.map((job) => {
            return (
              job.job && <JobCard
                key={job.id}
                job={job.job}
                setJobs={setJobs}
                setSavedJobLoading={setSavedJobLoading}
              />
            )
          })
        ) : (
          <div>No Jobs Found 🙄</div>
        )}
      </div>
    </div>
  )
}

export default SavedJobs