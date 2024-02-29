import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { v4 as uuid } from 'uuid';

import { PrismaClient } from '@prisma/client';
import { ApolloError } from 'apollo-server-core';

const prisma = new PrismaClient();

export async function createUser(parent: any, args: any, context: any) {
  try {
    // Validate input data
    if (!args.password || args.password.length < 8) {
      throw new ApolloError(
        'Password must be at least 8 characters long.',
        'INVALID_PASSWORD'
      );
    }

    // Hash the password
    const password = await bcrypt.hash(args.password, 10);

    // Create the user in the database
    const user = await prisma.user.create({ data: { ...args, password } });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'defaultSecret'
    );

    return {
      token,
      user,
    };
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error creating user:', error);

    // Rethrow the error to be handled by Apollo Server
    throw new ApolloError('Failed to create user.', 'INTERNAL_SERVER_ERROR');
  }
}

export const signIn = async (parent: any, args: any, context: any) => {
  console.log(args, 'hey');

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email: args?.loginInput?.email },
  });

  // If user doesn't exist, throw an authentication error
  if (!user) {
    throw new ApolloError('Invalid email or password', 'NOT_AUTHORIZED');
  }

  // Compare the provided password with the hashed password stored in the database
  const isValidPwd = await bcrypt.compare(
    args?.loginInput?.password,
    user.password || ''
  );

  // If password is invalid, throw an authentication error
  if (!isValidPwd) {
    throw new ApolloError('Invalid email or password', 'NOT_AUTHORIZED');
  }

  // Generate a JWT token for authentication
  const jwtToken = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET || 'defaultSecret', // Use environment variable for JWT secret
    {
      expiresIn: '1h', // Token expires in 1 hour
    }
  );

  // Return the token along with its type
  return { token: jwtToken, type: 'bearer' };
};

export const signOut = async (parent: any, args: any, context: any) => {
  console.log(args, 'heyyy');
  try {
    await prisma.user.update({
      where: { id: args.userId },
      data: { apiToken: null },
    });
    return { token: '', type: 'bearer' };
  } catch (updUserErr) {
    console.error('Failed to nullify API token', { error: updUserErr });
    throw updUserErr;
  }
};
