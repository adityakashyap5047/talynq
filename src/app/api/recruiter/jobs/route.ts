import { db } from "@/lib/prisma";
import clerkClient from "@clerk/clerk-sdk-node";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){

    try {
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json(
                { error: "User not authenticated." },
                { status: 401 }
            );
        }

        const existingUser = await db?.user.findUnique({
            where: {
                clerkUserId: user?.id
            },
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        const isRecruiter = await clerkClient.users.getUser(user.id);
        const unsafeMetadata = isRecruiter.unsafeMetadata;

        if (unsafeMetadata?.role !== "recruiter") {
            return NextResponse.json(
                { error: "User is not a recruiter." },
                { status: 403 }
            );
        }

        const recruiterId = existingUser.id;
        const data  = await request.json();

        const job = await db?.jobs.create({
            data: {
                ...data,
                recruiter_id: recruiterId,
            }
        });

        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                error: (error as Error).message || "Unknown error occurred while adding job."
            },
            {
                status: 500
            }
        );
    }
}

export async function GET() {
    try {
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json(
                { error: "User not authenticated." },
                { status: 401 }
            );
        }

        const existingUser = await db?.user.findUnique({
            where: {
                clerkUserId: user?.id
            },
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        const isRecruiter = await clerkClient.users.getUser(user.id);
        const unsafeMetadata = isRecruiter.unsafeMetadata;

        if (unsafeMetadata?.role !== "recruiter") {
            return NextResponse.json(
                { error: "User is not a recruiter." },
                { status: 403 }
            );
        }

        const jobs = await db.jobs.findMany({
            where: {
                recruiter_id: existingUser.id
            }
        });

        if (!jobs || jobs.length === 0) {
            return NextResponse.json({error: "No Jobs Found"}, {status: 202})
        }

        return NextResponse.json(jobs, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error: (error as Error).message || "Unknown error occurred while fetching jobs."
            },
            {
                status: 500
            }
        );
    }
}