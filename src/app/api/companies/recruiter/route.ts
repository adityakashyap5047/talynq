import { NextResponse } from "next/server";
import { clerkClient } from '@clerk/clerk-sdk-node';
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function GET() {
    try{
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

        const companies = await db?.company.findMany({
            where: {
                recruiter_id: recruiterId
            }
        });

        if (!companies || companies.length === 0) {
            return NextResponse.json(
                {
                    message: "No companies found. Please add a company to continue.",
                    code: "NO_COMPANY_FOUND"
                },
                { status: 202 }
            );
            
        }

        return NextResponse.json(companies, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error: (error as Error).message || "Unknown error occurred while adding user."
            },
            {
                status: 500
            }
        );
    }
}