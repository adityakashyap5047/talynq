import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    
    try {
        const { id } = await params;
        const user = await currentUser();

        if (!user) {
            return new Response("Unauthorized", { status: 401 });
        }
        const job = await db.jobs.findUnique({
            where: {
                id: id
            },
            include: {
                company: true,
                applications: true
            }
        })

        if (job) {
            return NextResponse.json(job, { status: 200 });
        }

        return NextResponse.json({ error: "Job not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
    }
    
}