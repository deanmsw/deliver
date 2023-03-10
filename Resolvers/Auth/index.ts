import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function createUser(parent: any, args: any, context: any) {
  const password = await bcrypt.hash(args.password, 10)
  
  const user = await prisma.user.create({ data: { ...args, password } })

  const token = jwt.sign({ userId: user.id }, 'hello world')

  return {
    token,
    user,
  }
}
