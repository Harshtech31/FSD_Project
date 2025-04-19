import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import clientPromise from '@/lib/mongodb'
import * as authFallback from '@/lib/auth-fallback'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let result;

    try {
      // Try to connect to MongoDB
      const client = await clientPromise
      const db = client.db('flowroute')
      const usersCollection = db.collection('users')

      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email })
      if (existingUser) {
        console.log('Registration failed: Email already exists:', email)
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      result = await usersCollection.insertOne({
        name,
        email,
        password: hashedPassword,
        avatar: '/avatars/default.png',
        createdAt: new Date(),
      })
    } catch (dbError) {
      console.error('MongoDB connection error:', dbError)
      console.log('Falling back to development authentication for registration')

      // Use fallback authentication in development
      if (process.env.NODE_ENV === 'development') {
        try {
          // Ensure test user exists first
          await authFallback.createTestUser()

          // Create user using fallback system
          result = await authFallback.createUser({
            name,
            email,
            password
          })

          console.log('Using fallback authentication for development registration')
        } catch (fallbackError) {
          console.error('Fallback registration error:', fallbackError)

          // Check if it's a duplicate email error
          if (fallbackError instanceof Error &&
              fallbackError.message.includes('already exists')) {
            return NextResponse.json(
              { error: 'User with this email already exists' },
              { status: 409 }
            )
          }

          return NextResponse.json(
            { error: 'Registration error' },
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

    return NextResponse.json(
      {
        message: 'User registered successfully',
        userId: result.insertedId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
