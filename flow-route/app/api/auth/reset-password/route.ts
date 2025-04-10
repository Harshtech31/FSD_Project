import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import clientPromise from '@/lib/mongodb';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('flowroute');
    const usersCollection = db.collection('users');
    const resetTokensCollection = db.collection('resetTokens');

    // Find the token
    const resetToken = await resetTokensCollection.findOne({ token });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > new Date(resetToken.expires)) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await usersCollection.findOne({ email: resetToken.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await usersCollection.updateOne(
      { email: resetToken.email },
      { $set: { password: hashedPassword } }
    );

    // Delete the used token
    await resetTokensCollection.deleteOne({ token });

    // Send confirmation email
    await sendEmail({
      to: resetToken.email,
      subject: 'Your Password Has Been Reset',
      html: `
        <h1>Password Reset Successful</h1>
        <p>Your password for FlowRoute has been successfully reset.</p>
        <p>If you did not request this change, please contact support immediately.</p>
      `,
    });

    return NextResponse.json(
      { message: 'Password has been reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
