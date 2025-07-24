"use client";

import { Job } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";

const CreatedJobs = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/recruiter/jobs');
                if (response.status === 200) {
                    setJobs(response.data);
                }
            } catch (error) {
                setError((error as Error).message || "Failed to fetch jobs.");
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return <BarLoader width={"100%"} color="#3b82f6" className='mx-auto my-8' />
    }

    if (error) {
        return <div className='text-red-500 py-1 mx-4 rounded-sm bg-slate-800 text-center my-8'>{error}</div>;
    }

    return (
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs?.length ? (
          jobs.map((job) => {
            return (
              <JobCard
                key={job.id}
                job={job}
                isMyJob={true}
              />
            )
          })
        ) : (
          <div>No Jobs Found 🙄</div>
        )}
      </div>
    )
}

export default CreatedJobs