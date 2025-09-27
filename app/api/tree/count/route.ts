import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    
    // If client sends JSON with imageUrl, proxy to FastAPI GET /predict_url
    if (contentType?.includes("application/json")) {
      const body = await request.json();
      const { imageUrl } = body;
      if (!imageUrl || typeof imageUrl !== "string") {
        return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
      }

      const url = new URL("http://localhost:8000/predict_url");
      url.searchParams.set("url", imageUrl);

      const pythonResponse = await fetch(url.toString(), {
        method: "GET",
      });

      if (!pythonResponse.ok) {
        const errorText = await pythonResponse.text();
        console.error("Python service error:", pythonResponse.status, errorText);
        throw new Error(`Python service error: ${pythonResponse.status} - ${errorText}`);
      }

      const result = await pythonResponse.json();
      return NextResponse.json({ success: true, count: result.tree_count ?? 0, data: result });
    }

    // Otherwise, accept multipart/form-data file and send to older /predict endpoint for backward compatibility
    if (contentType?.includes("multipart/form-data")) {
      const formDataIn = await request.formData();
      const file = formDataIn.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const formData = new FormData();
      const blob = new Blob([buffer], { type: file.type || 'application/octet-stream' });
      formData.append('file', blob, file.name || 'image');

      const pythonResponse = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!pythonResponse.ok) {
        const errorText = await pythonResponse.text();
        console.error("Python service error:", pythonResponse.status, errorText);
        throw new Error(`Python service error: ${pythonResponse.status} - ${errorText}`);
      }

      const result = await pythonResponse.json();
      return NextResponse.json({ success: true, count: result.count || result.tree_count || 0, data: result });
    }

    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });

  } catch (error) {
    console.error("Tree counting error:", error);
    return NextResponse.json(
      { error: "Failed to process image", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
