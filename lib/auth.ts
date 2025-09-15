import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import User from '@/lib/models/User';
import { connectDB } from '@/lib/db/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export async function verifyToken(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return null;
    }

    return {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function createToken(userId: string, email: string, role: string): string {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
