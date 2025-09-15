import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { UserService } from '@/lib/utils/database';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already exists in MongoDB
    const existingUser = await UserService.findByClerkId(userId);
    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        data: existingUser,
        message: 'User already exists' 
      });
    }

    // Get user data from Clerk
    const { user } = await auth();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      profileImage: user.imageUrl || '',
      role: user.publicMetadata?.role as 'user' | 'org' | 'admin' || 'user',
      organizationName: user.publicMetadata?.organizationName as string || '',
      contactPhone: user.phoneNumbers[0]?.phoneNumber || '',
      isActive: true,
      preferences: {
        notifications: true,
        emailUpdates: true,
        language: 'en'
      },
      metadata: {
        clerkCreatedAt: user.createdAt,
        clerkUpdatedAt: user.updatedAt,
        lastSignInAt: user.lastSignInAt
      }
    };

    // Create user in MongoDB
    const newUser = await UserService.createUser(userData);

    return NextResponse.json({ 
      success: true, 
      data: newUser,
      message: 'User created successfully' 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
