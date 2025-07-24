import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { error: "User not authenticated." },
                { status: 401 }
            );
        }

        const existingUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id
            },   
            select: {id: true}
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found in DB." },
                { status: 404 }
            );
        }

        const { jobId } = await request.json();

        const savedJob = await db.savedJobs.findFirst({
            where: {
                user_id: existingUser.id,
                job_id: jobId
            }
        });

        if(savedJob) {
            await db.savedJobs.delete({
                where: {
                    id: savedJob.id
                }
            })

            return NextResponse.json({ removed: true }, { status: 200 });
        } else {
            const newSavedJob = await db.savedJobs.create({
                data: {
                    user_id: existingUser.id,
                    job_id: jobId,
                },
            });
            return NextResponse.json({ saved: true, savedJob: newSavedJob }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json(
            {
                error: (error as Error).message || "Something went wrong while saving the job.",
            },
            { status: 500 }
        );
    }
}

export async function GET(){
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { error: "User not authenticated." },
                { status: 401 }
            );
        }

        const existingUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id
            },   
            select: {id: true}
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found in DB." },
                { status: 404 }
            );
        }

        const savedJobs = await db.savedJobs.findMany({
            where: {
                user_id: existingUser.id
            },
            include: {
                job: {
                    include: {
                        company: true,
                    }
                }
            }
        });

        if(!savedJobs || savedJobs.length === 0) {
            return NextResponse.json({ 
                message: "No saved jobs found.",
                code: "NO_SAVED_JOBS"
            }, { status: 202 });
        }
        return NextResponse.json(savedJobs, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error: (error as Error).message || "Something went wrong while fetching the saved jobs.",
            },
            { status: 500 }
        );
    }
}