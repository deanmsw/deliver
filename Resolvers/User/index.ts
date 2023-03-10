
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function allUsers () {
      return prisma.user.findMany();
    }
export function User (args: any) {
      return prisma.user.findUnique({where: {email: args.email}});
    }
    

