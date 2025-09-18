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

    const result = await NGOProjectService.searchSubmissions(
      filters,
      pagination
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

// POST /api/projects - Create a new project submission
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate the form data
    console.log("body", body);
    // const validatedData = NGOFormSubmissionSchema.parse(body);

    // Create the project submission
    const submission = await NGOProjectService.createSubmission(body, userId);
    await Credit.create({
      clerkId: userId,
      email:submission.contactEmail,
      role:submission.organizationName? "org" :"user",
      projectId: submission.id,
      organizationName: submission.organizationName,
      pendingCredit: submission.proposedCredit,
      status: "pending",     
    });
    return NextResponse.json(
      {
        success: true,
        data: submission,
        message: "Project submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
