import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getCurrentUser } from "@/lib/auth";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: string;
}

export async function POST(request: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "An image file is required." }, { status: 400 });
        }
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
        }
        if (file.size > MAX_IMAGE_SIZE) {
            return NextResponse.json({ error: "Choose an image smaller than 5 MB." }, { status: 413 });
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "podify" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResult);
                    }
                );
                uploadStream.end(buffer);
            }
        );
        return NextResponse.json(
            { publicId: uploadResult.public_id },
            { status: 200 }
        );
    } catch (error) {
        console.log("Upload image Error", error);
        return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
    }
}