
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

export async function allUsers (parent: any, args: any, context: any) {
      return await prisma.user.findMany();
    }
export async function User (parent: any, args: any, context: any) {
      return await  prisma.user.findMany({where: {email: args.email}});   
    }
    
export async function updateUser (parent: any, args: any, context: any) {
  const password = await bcrypt.hash(args.password, 10)

  return await prisma.user.update({
    where: {
      email: args.email,
    },
    data: {
      ...args,
      password: password
    },
})
}
    
export async function deleteUser (parent: any, args: any, context: any) {
  await prisma.user.delete({
    where: {
      email: args.email
    },
  })
}


