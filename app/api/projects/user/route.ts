import { NextRequest, NextResponse } from "next/server";
import { NGOProjectService } from "@/lib/utils/database";
import { NGOFormSubmissionSchema } from "@/lib/validations/schemas";
import { auth } from "@clerk/nextjs/server";
import { Credit } from "@/lib/models/Credit";

// GET /api/projects - Get projects with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const projectType = searchParams.get("projectType") as
      | "blue"
      | "green"
      | "yellow"
      | null;

    const filters: any = {};
    if (status) filters.status = status;
    if (projectType) filters.projectType = projectType;

    const pagination = { page, limit };

    const result = await NGOProjectService.getSubmissionsByUser(
      userId,pagination
    );

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}