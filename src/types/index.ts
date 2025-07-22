export interface User {
  id: string;
  clerkUserId: string;
  email: string;
  name?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  jobs?: Job[];
  applications?: Application[];
  savedJobs?: SavedJob[];
}

export interface Company {
  id: string;
  name: string;
  logo_url: string;
  createdAt: string;
  updatedAt: string;
  jobs?: Job[];
}

export interface Job {
  id: string;
  recruiter_id: string;
  recruiter: User;
  title: string;
  company_id: string;
  company: Company;
  description: string;
  location: string;
  requirements: string;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
  applications: Application[];
  savedJobs: SavedJob[];
}

export interface Application {
  id: string;
  job_id: string;
  job?: Job;
  candidate_id: string;
  candidate?: User;
  status: ApplicationStatus;
  resumeUrl: string;
  skills: string;
  experience: number;
  education: string;
  name: string;
  email: string;
  phone: string;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  user?: User;
  job?: Job;
  createdAt: string;
  updatedAt: string;
}

export enum ApplicationStatus {
  APPLIED = "APPLIED",
  INTERVIEWING = "INTERVIEWING",
  HIRED = "HIRED",
  REJECTED = "REJECTED"
}