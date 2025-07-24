"use client";

import AddCompany from "@/components/AddCompany";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Company } from "@/types";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod"
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import { State } from "country-state-city";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form"
import { BarLoader } from "react-spinners";
import z from "zod";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  company_id: z.string().min(1, "Company ID is required"),
  requirements: z.string().min(1, "Requirements are required"),
})

const PostJob = () => {

  const { isLoaded, user } = useUser();
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [loadingCreatedJob, setLoadingCreatedJob] = useState<boolean>(false);
  const [errorCreatedJob, setErrorCreatedJob] = useState<string | null>(null);

  const [companyCode, setCompanyCode] = useState<string>("");

  const {register, control, handleSubmit, formState: { errors }, reset} = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      company_id: "",
      requirements: ""
    },
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    const fetchComapnies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/companies/recruiter");
        if (response.status === 200) {
          setCompanies(response.data);
        } else if (response.status === 202 && response.data.code === "NO_COMPANY_FOUND") {
          setCompanyCode(response.data.code);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred while fetching companies');
      } finally {
        setLoading(false);
      }
    }
    fetchComapnies();
  }, []);

  const onSubmit = (data: z.infer<typeof schema>) => {
    const postJob = async () => {
      setLoadingCreatedJob(true);
      setErrorCreatedJob(null);
      try {
        const response = await axios.post("/api/recruiter/jobs", data);
        if (response.status === 200) {
          router.push("/jobs");
        }
      } catch (error) {
        console.error('Error creating job:', error);
        setErrorCreatedJob(error instanceof Error ? error.message : 'An unexpected error occurred while creating the job');
      } finally {
        reset();
        setCompanyCode("");
        setLoadingCreatedJob(false);
      }
    }
    postJob();
  };

  if (!isLoaded || loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36db7" />
  }

  if(user?.unsafeMetadata?.role !== "recruiter") {
    return (
      <div className="text-center my-18 flex flex-col items-center justify-center">
        <h1 className="text-4xl flex-1 gradient-title font-bold my-8">Access Denied</h1>
        <p className="text-xl my-12">You must be a recruiter to post a job.</p>
        <Link href="/jobs">
          <Button variant={"blue"} size={"xl"}>Find Jobs</Button>
        </Link>
      </div>
    );
  }

  if(companyCode === "NO_COMPANY_FOUND") {
    return (
      <div className="text-center my-18 flex flex-col items-center justify-center">
        <h1 className="text-4xl flex-1 gradient-title font-bold my-8">No Companies Found</h1>
        <p className="text-xl my-12">Please add a company to continue.</p>
        <Link href="/add-company">
          <Button variant={"blue"} size={"xl"}>Add Company</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center px-8">Post a Job</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Location" />
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
            )}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select disabled={loading} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Company" />
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
            )}
          />
          <AddCompany />
        </div>
          {error && <p className="bg-slate-800 px-4 py-2 rounded-sm text-red-500">{error}</p>}
          {errors.location && <p className="text-red-500">{errors.location.message}</p>}
          {errors.company_id && <p className="text-red-500">{errors.company_id.message}</p>}
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && <p className="text-red-500">{errors.requirements.message}</p>}
        <Button disabled={loadingCreatedJob} type="submit" variant={"blue"} size={"lg"} className="mt-2">Submit</Button>
        {errorCreatedJob && <p className="bg-slate-800 mt-4 px-4 py-2 rounded-sm text-red-500">{errorCreatedJob}</p>}
        {loadingCreatedJob && <BarLoader className="mt-4" width={"100%"} color="#36db7" />}
      </form>
    </div>
  )
}

export default PostJob