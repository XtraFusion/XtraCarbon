import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { UserService } from '@/lib/utils/database';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Check if user already exists in MongoDB
    const existingUser = await UserService.findByClerkId(userId);
    if (existingUser) {
      // Update last login
      await existingUser.updateLastLogin();
      
      // Redirect based on role
      const redirectUrl = existingUser.role === 'org' 
        ? '/org/dashboard' 
        : existingUser.role === 'admin' 
          ? '/admin' 
          : '/user/dashboard';
      
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Get user data from Clerk
    const { user } = await auth();
    if (!user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
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
    await UserService.createUser(userData);

    // Redirect based on role
    const redirectUrl = userData.role === 'org' 
      ? '/org/dashboard' 
      : userData.role === 'admin' 
        ? '/admin' 
        : '/user/dashboard';

    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}
