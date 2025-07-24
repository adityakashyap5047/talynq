import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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

        return NextResponse.json({ isSaved: !!savedJob }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error: (error as Error).message || "Something went wrong while saving the job.",
            },
            { status: 500 }
        );
    }
}