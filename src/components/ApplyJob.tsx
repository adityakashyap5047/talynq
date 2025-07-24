"use client";

import { Job } from "@/types";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import { useUser } from "@clerk/nextjs";

interface ApplyJobProps {
    job: Job | null;
    setJob: (job: Job | null) => void;
    applied?: boolean;
}

interface ApplyJobFormData {
    name: string;
    email: string;
    phone: string;
    experience: number;
    skills: string;
    education: "Intermediate" | "Graduate" | "Post Graduate";
    resume: FileList;
}

const schema = z.object({
    name: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone Number is required"),
    experience: z.number().min(0, "Years of Experience must be a positive number").int(),
    skills: z.string().min(1, "Skills are required"),
    education: z.enum(["Intermediate", "Graduate", "Post Graduate"]),
    resume: typeof FileList !== "undefined" ? z.instanceof(FileList).refine((file) => file[0] && (file[0].type === 'application/pdf' || file[0].type === 'application/msword' || file[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'), {
        message: "Resume must be a PDF or Word document"
    }) : z.any()
});

const ApplyJob = ({job, applied = false, setJob}: ApplyJobProps) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const {register, handleSubmit, control, formState: { errors }, reset} = useForm<ApplyJobFormData>({
        resolver: zodResolver(schema)
    })

    const { user } = useUser();

    const onSubmit = (data: ApplyJobFormData) => {
        const applyJob = async () => {
            setLoading(true);
            setError(null);
            try {
                const formData = new FormData();

                formData.append("name", data.name);
                formData.append("email", data.email);
                formData.append("phone", data.phone);
                formData.append("experience", String(data.experience));
                formData.append("skills", data.skills);
                formData.append("education", data.education);
                formData.append("resume", data.resume[0]);
                formData.append("job_id", job?.id ?? "");
                formData.append("status", "APPLIED");

                await axios.post("/api/application", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const response = await axios.get(`/api/jobs/${job?.id}`);
                setJob(response.data.job);
                reset();
            } catch (error) {
            console.error("Error fetching job:", error);
            setError(error instanceof Error ? error.message : "Failed to fetch job");
            } finally {
            setLoading(false);
            }
        };
        applyJob();
    }

    
  return (
    <Drawer open={applied ? false : undefined}>
        <DrawerTrigger asChild>
            <Button size={"lg"} className={`${job?.isOpen && !applied && "hover:!bg-red-500/50"}`}  variant={job?.isOpen && applied ? "blue" : "destructive"} disabled={!job?.isOpen || applied}>
                {job?.isOpen ? (applied ? "Applied" : "Apply Now") : "Job Closed"}
            </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-slate-800 mx-4">
            <DrawerHeader>
                <DrawerTitle>
                    Apply for {job?.title} at {job?.company?.name}
                </DrawerTitle>
                <DrawerDescription></DrawerDescription>
            </DrawerHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
                <div className="bg-slate-900 rounded-sm">
                    <Input
                        type="text"
                        placeholder="Full Name"
                        className="flex-1"
                        defaultValue={user?.fullName || ""}
                        {...register("name")}
                    />
                    {errors?.name && (
                        <p className="text-red-500">{errors.name.message}</p>
                    )}
                </div>
                <div className="bg-slate-900 rounded-sm">
                    <Input
                        type="email"
                        placeholder="Email"
                        className="flex-1"
                        defaultValue={user?.emailAddresses[0]?.emailAddress || ""}
                        {...register("email")}
                    />
                    {errors?.email && (
                        <p className="text-red-500">{errors.email.message}</p>
                    )}
                </div>
                <div className="bg-slate-900 rounded-sm">
                    <Input
                        type="text"
                        placeholder="Phone Number"
                        className="flex-1"
                        {...register("phone")}
                    />
                    {errors?.phone && (
                        <p className="text-red-500">{errors.phone.message}</p>
                    )}
                </div>
                <div className="bg-slate-900 rounded-sm">
                    <Input
                        type="number"
                        placeholder="Years of Experience"
                        className="flex-1"
                        {...register("experience", {
                            valueAsNumber: true,
                        })}
                    />
                    {errors?.experience && (
                        <p className="text-red-500">{errors.experience.message}</p>
                    )}
                </div>
                <div className="bg-slate-900 rounded-sm">
                    <Input
                            type="text"
                            placeholder="Skills (Comma separated)"
                            className="flex-1"
                        {...register("skills")}
                    />
                    {errors?.skills && (
                        <p className="text-red-500">{errors.skills.message}</p>
                    )}
                </div>
                <Controller 
                    name="education"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup className="flex flex-col sm:flex-row" onValueChange={field.onChange} {...field}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem className="bg-slate-900" value="Intermediate" id="intermediate" />
                                <label htmlFor="intermediate">Intermediate</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Graduate" id="graduate" />
                                <label htmlFor="graduate">Graduate</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Post Graduate" id="post-graduate" />
                                <label htmlFor="post-graduate">Post Graduate</label>
                            </div>
                        </RadioGroup>
                    )}
                />
                {errors?.education && (
                    <p className="text-red-500">{errors.education.message}</p>
                )}
                <div className="bg-slate-900 rounded-sm">
                    <Input
                        type="file"
                        accept=".pdf, .doc, .docx"
                        className="flex-1 file:text-gray-500 file:pr-4"
                        {...register("resume")}
                    />
                    {errors?.resume && (
                        <p className="text-red-500">{errors.resume.message}</p>
                    )}
                </div>
                <Button disabled={loading} type="submit" variant={"blue"} size={"lg"}>
                    Apply
                </Button>
            </form>
            <DrawerFooter>
                <DrawerClose asChild>
                    <Button onClick={() => reset()} disabled={loading} className="bg-slate-900 hover:bg-slate-900/50 text-white">Cancel</Button>
                </DrawerClose>
                {error && (
                    <div className='text-red-500 bg-slate-800 p-4 rounded-sm mx-4 sm:mx-0'>
                        Error: {error}
                    </div>
                )}
                {loading && <BarLoader width={"100%"} color='#1d293d' />}
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}

export default ApplyJob