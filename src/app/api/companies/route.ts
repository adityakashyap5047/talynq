import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET() {
    try {

        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { error: "User not authenticated." },
                { status: 401 }
            );
        }

        const companies = await db?.company.findMany()

        if (!companies || companies.length === 0) {
            return NextResponse.json({ message: "No companies found" }, { status: 202 });
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