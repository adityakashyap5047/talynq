import { db } from "@/lib/prisma";
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

        const existingUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id,
            },
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        const jobData = await request.json();
        const random = Math.floor(Math.random() * 90000);
        const fileName = `resume-${random}-${existingUser.id}`;
        
        // upload pdf in imagekit with filename and jobData.resume and give the imagekit url in jobData.resume
        const resumeUrl = `resume/${fileName}.pdf`;
        
        delete jobData.resume;
        const application = await db.application.create({
            data: {
                ...jobData,
                candidate_id: existingUser.id,
                resumeUrl
            }
        });

        return NextResponse.json(application, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
    }
}