import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
    try {
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json(
                { error: "User not authenticated." },
                { status: 401 }
            );
        }
        
        const {location, company_id, searchQuery, page = 1, limit = 6} = await request.json();
        const filters: object[] = [];

        if (location) {
        filters.push({
            location: {
            contains: location,
            mode: "insensitive"
            }
        });
        }

        if (company_id) {
        filters.push({
            company_id: company_id
        });
        }

        if (searchQuery) {
        filters.push({
            OR: [
            {
                title: {
                contains: searchQuery,
                mode: "insensitive"
                }
            },
            {
                description: {
                contains: searchQuery,
                mode: "insensitive"
                }
            },
            {
                requirements: {
                contains: searchQuery,
                mode: "insensitive"
                }
            }
            ]
        });
        }

        const whereClause = filters.length > 0 ? { AND: filters } : undefined;

        const [jobs, total] = await Promise.all([
            db.jobs.findMany({
                where: whereClause,
                include: {
                recruiter: true,
                company: true,
                savedJobs: true,
                },
                orderBy: {
                createdAt: "desc"
                },
                skip: (page - 1) * limit,
                take: limit
            }),
            db.jobs.count({ where: whereClause })
        ]);

        if (jobs) {
            return NextResponse.json({ jobs, total }, {
                status: 200
            });
        }

        return NextResponse.json(
            { error: "No jobs found." },
            { status: 404 }
        );

    } catch (error: unknown) {
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