import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }){

    try {
        const { id } = await params; 
        const { status } = await request.json();
        
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
                { error: "User not found in DB." },
                { status: 404 }
            );
        }

        const application = await db.application.findUnique({
            where: {id},
            include: {
                job: true
            }
        });
        if (application?.job?.recruiter_id !== existingUser.id) {
            return NextResponse.json({error: "You don't have permission to do this"}, {status: 401});
        }

        const updatedApplication = await db.application.update({
            where: {id},
            data: {status}
        })

        return NextResponse.json(updatedApplication, {status: 200})
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
    }

}