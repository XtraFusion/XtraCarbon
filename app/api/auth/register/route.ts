import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/db/mongodb'
import User from '@/lib/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, password, firstName, lastName, role, organizationName } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate a unique clerkId for demo purposes
    const clerkId = `clerk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create new user
    const newUser = new User({
      clerkId,
      email: email.toLowerCase(),
      firstName: firstName || '',
      lastName: lastName || '',
      role: role || 'user',
      organizationName: organizationName || '',
      isActive: true,
      preferences: {
        notifications: true,
        emailUpdates: true,
        language: 'en'
      }
    })

    await newUser.save()

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
        clerkId: newUser.clerkId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return user data (excluding sensitive information)
    const userData = {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      organizationName: newUser.organizationName,
      profileImage: newUser.profileImage,
      createdAt: newUser.createdAt
    }

    return NextResponse.json({
      message: 'Registration successful',
      token,
      user: userData
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
