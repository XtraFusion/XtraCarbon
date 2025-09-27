import { NextRequest, NextResponse } from "next/server";
import { NGOProjectService } from "@/lib/utils/database";
import { auth } from "@clerk/nextjs/server";
import { User, NGOProjectSubmission } from "@/lib/models";

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
    // Two modes:
    // 1) Verifier actions: { action: 'confirm'|'reject'|'send_back'|'start', issuedCredit?, message? }
    // 2) Edit submission: { updates: Partial<NGOProject>, setReapply?: boolean }

    const { action, issuedCredit, message, updates, setReapply } = body || {};

    let updated;
    if (action) {
      updated = await NGOProjectService.applyVerifierAction({
        projectId: id,
        verifierId: userId,
        action,
        issuedCredit,
        message,
      });
    } else if (updates && typeof updates === "object") {
      // Generic update path for editing submissions by the submitter
      const nextUpdate: any = { ...updates };
      if (setReapply) {
        // Map requested 'reapply' to schema's allowed status
        nextUpdate.submissionStatus = "submitted"; // treated as re-apply for review
        nextUpdate.verificationStatus = "pending";
        // Clear previous review metadata if any
        nextUpdate.reviewComments = undefined;
        nextUpdate.reviewDate = undefined;
      }

      updated = await NGOProjectSubmission.findByIdAndUpdate(id, nextUpdate, {
        new: true,
      });
    } else {
      return NextResponse.json({ error: "Missing action or updates" }, { status: 400 });
    }

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


