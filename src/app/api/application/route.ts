import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import FormData from "form-data";
import axios from "axios";
import { ApplicationStatus } from "@/types";

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

        const formData = await request.formData();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const experience = parseInt(formData.get("experience") as string);
        const skills = formData.get("skills") as string;
        const education = formData.get("education") as string;
        const job_id = formData.get("job_id") as string;
        const status = formData.get("status") as ApplicationStatus || "APPLIED";

        const resumeFile = formData.get("resume") as File;

        if (!resumeFile) {
            return NextResponse.json({ error: "Resume file is missing." }, { status: 400 });
        }

        const buffer = Buffer.from(await resumeFile.arrayBuffer());
        const fileName = `resume-${Math.floor(Math.random() * 90000)}-${existingUser.id}.pdf`;

        const imagekitForm = new FormData();
        imagekitForm.append("file", buffer, {
            filename: fileName,
            contentType: resumeFile.type,
        });
        imagekitForm.append("fileName", fileName);
        imagekitForm.append("useUniqueFileName", "true");
        imagekitForm.append("folder", "/Talynq/resumes");

        const imagekitResponse = await axios.post("https://upload.imagekit.io/api/v1/files/upload", imagekitForm, {
            headers: {
                ...imagekitForm.getHeaders(),
                Authorization: "Basic " + Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY + ":").toString("base64"),
            },
        });

        const resumeUrl = imagekitResponse.data.url;
        
         const application = await db.application.create({
            data: {
                name,
                email,
                phone,
                experience,
                skills,
                education,
                job_id,
                status,
                candidate_id: existingUser.id,
                resumeUrl,
            },
        });

        return NextResponse.json(application, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
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

        const applications = await db?.application.findMany({
            where: {
                candidate_id: existingUser.id
            },
            include: {
                job: {
                    include: {
                        company: true
                    }
                }
            }
        });

        if(!applications || applications.length === 0) {
            return NextResponse.json(
                { error: "No applications found." },
                { status: 202 }
            );
        }

        return NextResponse.json(applications, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error: (error as Error).message || "Unknown error occurred while fetching applications."
            },
            {
                status: 500
            }
        );
    }
}