import { Application, ApplicationStatus } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import axios from "axios";
import { useState } from "react";
import { BarLoader } from "react-spinners";

interface ApplicationCardProps {
  application: Application;
  isCandidate?: boolean;
}

const ApplicationCard = ({ application, isCandidate = false }: ApplicationCardProps) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>();
    const [status, setStatus] = useState<ApplicationStatus>(application.status);

    const handleDownloadResume = () => {
        const link = document.createElement('a');
        link.href = application.resumeUrl;
        link.target = '_blank';
        link.click();
    }

    const handleSelectStatus = (value: ApplicationStatus) => {
        const changeStatus = async() => {
            
            setLoading(true);
            setError(null);

            const previousStatus = status;
            setStatus(value);
            try {
                const response = await axios.post(`/api/application/${application.id}`, {
                    status: value
                });
                setStatus(response.data.status);
            } catch (error) {
                console.error("Error fetching job:", error);
                setError(error instanceof Error ? error.message : "Failed to fetch job");
                setStatus(previousStatus);
            } finally {
                setLoading(false);
            }
        }
        changeStatus();
    };

    return (
        <Card className="bg-slate-800 text-white p-4">
            {loading && <div className="px-4"><BarLoader width={"100%"} color="36d7b7" /></div>}
            <CardHeader>
                <CardTitle className="flex justify-between font-bold">
                    {isCandidate 
                        ? `${application?.job?.title} at ${application?.job?.company?.name}`
                        : `${application?.name}`
                    }
                    <Download
                        size={18}
                        className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
                        onClick={handleDownloadResume}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
                <div className="flex flex-col gap-2 md:flex-row justify-between">
                    <div className="flex gap-2 items-center">
                        <BriefcaseBusiness size={15} /> {application?.experience} years of experience
                    </div>
                    <div className="flex gap-2 items-center">
                        <School size={15} /> {application?.education}
                    </div>
                    <div className="flex gap-2 items-center">
                        <Boxes size={15} /> Skills: {application?.skills}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <span>{new Date(application.createdAt).toLocaleDateString()}</span>
                {isCandidate ? <span className="font-bold">Status: {application?.status}</span> : (
                    <Select 
                        disabled={loading} 
                        onValueChange={handleSelectStatus} 
                        defaultValue={status}
                    >
                        <SelectTrigger 
                            className={`w-52 cursor-pointer
                                ${status === 'REJECTED' ? "!bg-red-900" 
                                    : status === 'INTERVIEWING' ? "!bg-orange-900"
                                    : status === 'HIRED' ? "!bg-green-900"
                                    : "!bg-gray-500"
                                }
                            `}
                        >
                            <SelectValue placeholder={"Application Status"}/>
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-white">
                            <SelectItem className="cursor-pointer data-[highlighted]:bg-slate-900 my-2 bg-gray-500" value={'APPLIED'}>APPLIED</SelectItem>
                            <SelectItem className="cursor-pointer data-[highlighted]:bg-slate-900 my-2 bg-orange-900" value={'INTERVIEWING'}>INTERVIEWING</SelectItem>
                            <SelectItem className="cursor-pointer data-[highlighted]:bg-slate-900 my-2 bg-green-900" value={'HIRED'}>HIRED</SelectItem>
                            <SelectItem className="cursor-pointer data-[highlighted]:bg-slate-900 my-2 bg-red-900" value={'REJECTED'}>REJECTED</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            </CardFooter>
            {error && <p className="text-red-500 bg-slate-700 px-4 rounded-sm py-1 mt-4">{error}</p>}
        </Card>
    )
}

export default ApplicationCard