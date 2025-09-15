import { NextRequest, NextResponse } from 'next/server';
import { VerifierService } from '@/lib/utils/database';
import { VerifierFormSubmissionSchema } from '@/lib/validations/schemas';
import { auth } from '@clerk/nextjs/server';

// GET /api/verifications - Get verifications with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const projectType = searchParams.get('projectType') as 'blue' | 'green' | 'yellow' | null;

    const filters: any = {};
    if (status) filters.status = status;
    if (projectType) filters.projectType = projectType;

    const pagination = { page, limit };
    
    // Get verifications for the current user (verifier)
    const result = await VerifierService.getVerificationsByVerifier(userId, pagination);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/verifications - Create a new verification
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectSubmissionId, ...formData } = body;
    
    if (!projectSubmissionId) {
      return NextResponse.json(
        { error: 'Project submission ID is required' },
        { status: 400 }
      );
    }
    
    // Validate the form data
    const validatedData = VerifierFormSubmissionSchema.parse(formData);
    
    // Create the verification
    const verification = await VerifierService.createVerification(
      validatedData, 
      userId, 
      projectSubmissionId
    );

    return NextResponse.json({
      success: true,
      data: verification,
      message: 'Verification created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating verification:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
