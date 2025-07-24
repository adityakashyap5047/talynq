import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import clerkClient from "@clerk/clerk-sdk-node";
import { currentUser } from "@clerk/nextjs/server";
import FormData from "form-data";
import axios from "axios";

export async function POST(request: NextRequest){
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

        const isRecruiter = await clerkClient.users.getUser(user.id);
        const unsafeMetadata = isRecruiter.unsafeMetadata;

        if (unsafeMetadata?.role !== "recruiter") {
            return NextResponse.json(
                { error: "User is not a recruiter." },
                { status: 403 }
            );
        }

        const recruiterId = existingUser.id;

        const formData = await request.formData();
        const name = formData.get("name") as string;
        const logo = formData.get("logo") as File;

        if (!logo) {
            return NextResponse.json({ error: "Logo is missing." }, { status: 400 });
        }

        const buffer = Buffer.from(await logo.arrayBuffer());
        const fileName = `logo-${Math.floor(Math.random() * 90000)}-${recruiterId}.pdf`;

        const imagekitForm = new FormData();
        imagekitForm.append("file", buffer, {
            filename: fileName,
            contentType: logo.type,
        });
        imagekitForm.append("fileName", fileName);
        imagekitForm.append("useUniqueFileName", "true");
        imagekitForm.append("folder", "/Talynq/companies-logo");

        const imagekitResponse = await axios.post("https://upload.imagekit.io/api/v1/files/upload", imagekitForm, {
            headers: {
                ...imagekitForm.getHeaders(),
                Authorization: "Basic " + Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY + ":").toString("base64"),
            },
        });

        const logo_url = imagekitResponse.data.url;

        const company = await db.company.create({
            data: {
                recruiter_id: recruiterId,
                name,
                logo_url,
            }
        });

        return NextResponse.json(company, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                error: (error as Error).message || "Unknown error occurred while adding company."
            },
            {
                status: 500
            }
        );
    }
}