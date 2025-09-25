import { NextRequest, NextResponse } from "next/server";
import { NGOProjectService } from "@/lib/utils/database";
import { NGOProjectSubmission, User } from "@/lib/models";
import { Credit } from "@/lib/models/Credit";
import { ensureDBConnection } from "@/lib/utils/database";
import { auth } from "@clerk/nextjs/server";

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
    const projectUser = await User.findOne({clerkId:project.submittedBy});
    // console.log(projectUser)
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project ,projectUser:projectUser});
  } catch (error) {
    console.error("Error fetching project by id:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



// PUT /api/projects/[id] - Update project status and credits (verifier actions)
export async function PUT(
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
    const { action, message, issuedCredit, creditVintage } = body || {};

    if (!action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 });
    }

    await ensureDBConnection();

    const project = await NGOProjectSubmission.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Normalize fields
    const normalizedAction = String(action).toLowerCase();

    if (normalizedAction === "reject") {
      project.submissionStatus = "rejected" as any;
      project.verificationStatus = "rejected" as any;
      project.reviewComments = message || project.reviewComments;
      project.reviewDate = new Date();
      await project.save();
      return NextResponse.json({ success: true, data: project, message: "Project rejected" });
    }

    if (normalizedAction === "request_changes" || normalizedAction === "send_back") {
      project.submissionStatus = "requires_revision" as any;
      project.reviewComments = message || project.reviewComments;
      project.reviewDate = new Date();
      await project.save();
      return NextResponse.json({ success: true, data: project, message: "Sent back for changes" });
    }

    if (normalizedAction === "approve" || normalizedAction === "confirm") {
      const parsedIssued = typeof issuedCredit === "string" ? parseFloat(issuedCredit) : issuedCredit;
      const issued = Number.isFinite(parsedIssued) ? Number(parsedIssued) : undefined;
      const vintageNum = typeof creditVintage === "string" ? parseInt(creditVintage) : creditVintage;

      if (!issued || issued < 0) {
        return NextResponse.json({ error: "issuedCredit is required and must be >= 0" }, { status: 400 });
      }

      project.submissionStatus = "approved" as any;
      project.verificationStatus = "verified" as any;
      project.verifiedCarbonCredits = issued as any;
      if (vintageNum) {
        project.creditVintage = vintageNum as any;
      }
      project.reviewComments = message || project.reviewComments;
      project.reviewDate = new Date();
      await project.save();

      // Sync Credit record
      const credit = await Credit.findOne({ projectId: id });
      if (credit) {
        credit.pendingCredit = issued;
        credit.status = "active";
        await credit.save();
      }

      return NextResponse.json({ success: true, data: project, message: "Project approved and credits updated" });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
