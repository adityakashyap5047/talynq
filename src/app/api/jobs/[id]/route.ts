import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    
    try {
        const { id } = await params;
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const existingUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id
            }
        });

        if (!existingUser) {
            return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
        }

        const job = await db.jobs.findUnique({
            where: {
                id: id
            },
            include: {
                company: true,
                applications: {
                    include: {
                        job: {
                            include: {
                                company: true
                            }
                        }
                    }
                },
                recruiter: true
            }
        })

        if (job) {
            return NextResponse.json({job, userId: existingUser.id}, { status: 200 });
        }

        return NextResponse.json({ error: "Job not found" }, { status: 202 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
    }
    
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const {id} = await params;
        const {status} = await request.json();

        const user = await currentUser();
        if(!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const existingUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id
            }
        })

        if (!existingUser) {
            return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
        }

        const job = await db.jobs.findUnique({
            where: {
                id: id
            }
        })

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 202 });
        }

        if (job?.recruiter_id !== existingUser?.id) {
            return NextResponse.json({ error: "You don't have the permission to do this"}, {status: 401})
        }

        const updatedJob = await db.jobs.update({
            where: { id },
            data: { isOpen: status }
        })

        return NextResponse.json(updatedJob, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
    }
}