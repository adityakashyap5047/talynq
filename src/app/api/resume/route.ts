import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(){
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

        const resume = await db?.application.findFirst({
            where: { candidate_id: existingUser.id },
            orderBy: { createdAt: "desc" },
            select: { resumeUrl: true },
        });

        return NextResponse.json({ resumeUrl: resume?.resumeUrl || null }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error: (error as Error).message || "Unknown error occurred while fetching resume."
            },
            {
                status: 500
            }
        );
    }
}