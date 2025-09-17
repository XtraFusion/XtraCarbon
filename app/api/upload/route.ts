import { NextRequest, NextResponse } from "next/server";
import { uploadFileToBlob } from "@/lib/utils/vercel-blob";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
  //  console.log(request.formData)
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const filename = `uploads/${userId}/${Date.now()}-${file.name}`;
    const result = await uploadFileToBlob(file, filename, file.type);
    console.log(result);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        filename: result.filename,
        originalName: file.name,
        size: file.size,
        mimeType: file.type,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
