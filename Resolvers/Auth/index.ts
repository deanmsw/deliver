import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import { PrismaClient } from '@prisma/client';
import { ApolloError } from 'apollo-server-core';

const prisma = new PrismaClient();

export async function createUser(parent: any, args: any, context: any) {
  const password = await bcrypt.hash(args.password, 10);

  const user = await prisma.user.create({ data: { ...args, password } });

  const token = jwt.sign({ userId: user.id }, 'hello world');

  return {
    token,
    user,
  };
}

export const signIn = async (parent: any, args: any, context: any) => {
  console.log(args, 'hey');

  const user = await prisma.user.findUnique({
    where: { email: args?.loginInput?.email },
  });

  if (!user) return new ApolloError('NOT_AUTHORIZED_MSG, NOT_AUTHORIZED');

  const isValidPwd = await bcrypt.compare(
    args?.loginInput?.password,
    user.password || ''
  );

  // Check user exists and that the provided password matches the hashed version stored in the DB
  if (!isValidPwd) return new ApolloError('NOT_AUTHORIZED_MSG, NOT_AUTHORIZED');

  // if (!user.active) return new ApolloError('User Inactive');

  // Generate a token to be stored in the DB and used to verfiy that this is the latest version of the token
  const apiToken = uuid();
  // Save hashed version of the API token in the DB
  // await hashAndStoreApiToken(apiToken, user.id);
  // Total duration the token can be refreshed
  // const canBeRefreshedBefore = dayjs().add(2, 'w').unix();

  const jwtToken = jwt.sign(
    {
      api_token: apiToken,
      sub: Number(user.id),
    },
    'process.env.JWT_SECRET',
    {
      expiresIn: '1h',
    }
  );

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
