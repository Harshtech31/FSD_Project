/**
 * This file provides a fallback authentication system for development
 * when MongoDB connection is not available.
 *
 * DO NOT USE IN PRODUCTION!
 */

import bcrypt from 'bcrypt';

// Mock users for development (remove in production)
interface MockUser {
  _id: string;
  name: string;
  email: string;
  password: string; // hashed password
  avatar?: string;
  createdAt: Date;
}

// In-memory storage for mock users
const mockUsers: MockUser[] = [
  {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    // Password: password123
    password: '$2b$10$AQl/pKxc6TRCD2ZbgFMTFu8VrdW9CewtWqMvLGa/0F8gvt0iz/2Si',
    avatar: '/avatars/default.png',
    createdAt: new Date()
  }
];

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string): Promise<MockUser | null> {
  const user = mockUsers.find(u => u.email === email);
  return user || null;
}

/**
 * Create a new user
 */
export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
}): Promise<{ _id: string }> {
  // Check if user already exists
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Create new user
  const newUser: MockUser = {
    _id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    avatar: '/avatars/default.png',
    createdAt: new Date()
  };

  // Add to mock users array
  mockUsers.push(newUser);

  return { _id: newUser._id };
}

/**
 * Verify user credentials
 */
export async function verifyCredentials(email: string, password: string): Promise<MockUser | null> {
  console.log(`[Fallback Auth] Attempting to verify credentials for email: ${email}`);

  // Find user
  const user = await findUserByEmail(email);
  if (!user) {
    console.log(`[Fallback Auth] User not found with email: ${email}`);
    return null;
  }

  console.log(`[Fallback Auth] User found, verifying password...`);

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log(`[Fallback Auth] Password validation result: ${isPasswordValid}`);

  if (!isPasswordValid) {
    console.log(`[Fallback Auth] Invalid password for user: ${email}`);
    return null;
  }

  console.log(`[Fallback Auth] Login successful for user: ${email}`);
  return user;
}

/**
 * Get all users (for testing)
 */
export function getAllUsers(): MockUser[] {
  return [...mockUsers];
}

/**
 * Clear all users (for testing)
 */
export function clearAllUsers(): void {
  mockUsers.length = 0;
  // Add back the test user
  mockUsers.push({
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    // Password: password123
    password: '$2b$10$AQl/pKxc6TRCD2ZbgFMTFu8VrdW9CewtWqMvLGa/0F8gvt0iz/2Si',
    avatar: '/avatars/default.png',
    createdAt: new Date()
  });
}

/**
 * Create a test user with a known password (for development only)
 */
export async function createTestUser(): Promise<MockUser> {
  // Clear existing test user if it exists
  const existingUser = await findUserByEmail('test@example.com');
  if (existingUser) {
    // Remove the existing test user
    const index = mockUsers.findIndex(u => u.email === 'test@example.com');
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
  }

  // Create a new test user with a known password
  const testUser: MockUser = {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    // Plain password: password123
    password: '$2b$10$AQl/pKxc6TRCD2ZbgFMTFu8VrdW9CewtWqMvLGa/0F8gvt0iz/2Si',
    avatar: '/avatars/default.png',
    createdAt: new Date()
  };

  mockUsers.push(testUser);
  console.log('[Fallback Auth] Created test user with email: test@example.com and password: password123');

  return testUser;
}
