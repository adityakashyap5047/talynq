import { Application } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";

interface ApplicationCardProps {
  application: Application;
  isCandidate?: boolean;
}

const ApplicationCard = ({ application, isCandidate = false }: ApplicationCardProps) => {

    const handleDownloadResume = () => {
        const link = document.createElement('a');
        link.href = application.resumeUrl;
        link.target = '_blank';
        link.click();
    }

    console.log(application);

    return (
        <Card>
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
                    {!isCandidate ? <span className="font-bold">Status: {application?.status}</span> : <></>}
                </CardFooter>
            </CardHeader>
        </Card>
    )
}

export default ApplicationCard