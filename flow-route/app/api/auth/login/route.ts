import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'
import * as authFallback from '@/lib/auth-fallback'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    let user;
    let isPasswordValid = false;

    try {
      // Try to connect to MongoDB
      const client = await clientPromise
      const db = client.db('flowroute')
      const usersCollection = db.collection('users')

      // Find user
      user = await usersCollection.findOne({ email })
      if (!user) {
        console.log('Login failed: User not found with email:', email)
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      // Verify password
      isPasswordValid = await bcrypt.compare(password, user.password)
      console.log('Password validation result:', isPasswordValid)
      if (!isPasswordValid) {
        console.log('Login failed: Invalid password for user:', email)
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }
    } catch (dbError) {
      console.error('MongoDB connection error:', dbError)
      console.log('Falling back to development authentication')

      // Use fallback authentication in development
      if (process.env.NODE_ENV === 'development') {
        try {
          // Create a test user first to ensure it exists
          await authFallback.createTestUser()

          // Verify credentials using fallback system
          const fallbackUser = await authFallback.verifyCredentials(email, password)

          if (!fallbackUser) {
            console.log('Fallback login failed: Invalid credentials for:', email)
            return NextResponse.json(
              { error: 'Invalid credentials' },
              { status: 401 }
            )
          }

          // Use the fallback user
          user = fallbackUser
          isPasswordValid = true
          console.log('Using fallback authentication for development')
        } catch (fallbackError) {
          console.error('Fallback authentication error:', fallbackError)
          return NextResponse.json(
            { error: 'Authentication error' },
            { status: 500 }
          )
        }
      } else {
        // In production, return a database error
        return NextResponse.json(
          { error: 'Database connection error' },
          { status: 500 }
        )
      }
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
