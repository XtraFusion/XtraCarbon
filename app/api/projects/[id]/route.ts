import { NextRequest, NextResponse } from "next/server";
import { NGOProjectService } from "@/lib/utils/database";
import { auth } from "@clerk/nextjs/server";
import { User } from "@/lib/models";

// GET /api/projects/[id] - Get a single project by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const project = await NGOProjectService.getSubmissionById(id);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const projectUser =await User.findOne({clerkId:project.submittedBy})

    return NextResponse.json({ success: true, data: project,projectUser:projectUser });
  } catch (error) {
    console.error("Error fetching project by id:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/projects/[id] - Update submission and verification state
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const body = await request.json();
    // Expected body: { action: 'confirm'|'reject'|'send_back'|'start' , issuedCredit?, message? }
    const { action, issuedCredit, message } = body || {};
    if (!action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 });
    }

    const updated = await NGOProjectService.applyVerifierAction({
      projectId: id,
      verifierId: userId,
      action,
      issuedCredit,
      message
    });

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


