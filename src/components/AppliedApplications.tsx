"use client";

import { Application } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners';
import ApplicationCard from './ApplicationCard';

const AppliedApplications = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        const fetchApplications = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/application');
                if (response.status === 200) {
                    setApplications(response.data);
                }
            } catch (error) {
                setError((error as Error).message || "Failed to fetch applications.");
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) {
        return <BarLoader width={"100%"} color="#3b82f6" className='mx-auto my-8' />
    }

    if (error) {
        return <div className='text-red-500 py-1 mx-4 rounded-sm bg-slate-800 text-center my-8'>{error}</div>;
    }

    return (
        <div className='flex flex-col gap-2'>
            {applications.length ? (
                applications.map((application) => {
                    return (
                        <ApplicationCard
                            key={application.id}
                            application={application}
                            isCandidate={true}
                        />
                    )
                })
            ) : (
                <div>No Applications Found 🙄</div>
            )}
        </div>
    )
}

export default AppliedApplications