
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function allRoutes (parent: any, args: any, context: any) {
  return await prisma.route.findMany();
}

export async function route (parent: any, args: any, context: any) {
  return await prisma.route.findMany({where: {id: args.id}})
}


export async function createRoute(parent: any, args: any, context: any) {
  return await prisma.route.create({ data: { ...args } })
}

export async function updateRoute (parent: any, args: any, context: any) {

  return await prisma.route.update({
    where: {
      id: args.id
    },
    data: {
      ...args
    },
})
}

 export async function deleteRoute (parent: any, args: any, context: any) {
  await prisma.route.delete({
    where: {
      id: args.id
    },
  })
}
