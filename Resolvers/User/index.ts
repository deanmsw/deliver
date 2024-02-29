import { PrismaClient } from '@prisma/client';
import { ApolloError } from 'apollo-server-core';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function allUsers(parent: any, args: any, context: any) {
  return await prisma.user.findMany({
    include: {
      driver: true,
    },
  });
}
export async function User(parent: any, args: any, context: any) {
  return await prisma.user.findUnique({
    where: {
      email: args.email,
    },
    // include: {
    //   routes: true,
    // },
  });
}

export async function updateUser(parent: any, args: any, context: any) {
  try {
    // Validate input
    const { email, password, ...updateData } = args;
    if (!email) {
      throw new ApolloError(
        'Email is required for updating a user.',
        'INVALID_INPUT'
      );
    }

    // If password is provided, hash it
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        ...updateData,
        password: hashedPassword,
      },
    });

    // Optionally return updated user information
    return updatedUser;
  } catch (error) {
    // Handle errors
    console.error('Error updating user:', error);
    throw new ApolloError('Failed to update user.', 'INTERNAL_SERVER_ERROR');
  }
}

export async function deleteUser(parent: any, args: any, context: any) {
  try {
    // Validate input
    const { email } = args;
    if (!email) {
      throw new ApolloError(
        'Email is required for deleting a user.',
        'INVALID_INPUT'
      );
    }

    // Delete the user
    const deletedUser = await prisma.user.delete({
      where: {
        email: email,
      },
    });

    // Optionally return feedback or deleted user information
    return {
      success: true,
      message: `User with email ${deletedUser.email} has been deleted.`,
    };
  } catch (error) {
    // Handle errors
    console.error('Error deleting user:', error);
    throw new ApolloError('Failed to delete user.', 'INTERNAL_SERVER_ERROR');
  }
}
