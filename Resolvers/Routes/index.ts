import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function allRoutes(parent: any, args: any, context: any) {
  return await prisma.route.findMany({
    include: {
      driver: true,
      journeys: true,
      startLocation: true,
      endLocation: true,
    },
  });
}

export async function route(parent: any, args: any, context: any) {
  return await prisma.route.findUnique({
    where: { id: args.id },
    include: {
      driver: true,
    },
  });
}
export async function createRoute(parent: any, args: any, context: any) {
  // Check if the specified driver exists
  const existingUser = await prisma.user.findUnique({
    where: {
      id: args.driver.id,
    },
  });

  const existingDriver = await prisma.driver.findUnique({
    where: {
      id: args.driver.id,
    },
  });

  const checkDriverExists = () => {
    if (existingDriver) {
      return { userId: existingDriver.userId };
    } else {
      const createDriver = prisma.driver.create({
        data: {
          // @ts-ignore
          user: existingUser,
          userId: args.driver.id,
        },
      });
      return createDriver;
    }
  };

  if (!existingUser) {
    throw new Error(`User with Id: ${args.driver.id} not found.`);
  }

  const startLocation = {
    latitude: args.startLocation.latitude,
    longitude: args.startLocation.longitude,
  };

  const endLocation = {
    latitude: args.endLocation.latitude,
    longitude: args.endLocation.longitude,
  };

  return await prisma.route.create({
    data: {
      ...args,
      startLocation: {
        create: startLocation,
      },
      endLocation: {
        create: endLocation,
      },
      driver: {
        connect: checkDriverExists(),
      },
    },
    include: {
      driver: true,
      journeys: true,
      startLocation: true,
      endLocation: true,
    },
  });
}

export async function updateRoute(parent: any, args: any, context: any) {
  return await prisma.route.update({
    where: {
      id: args.id,
    },
    data: {
      ...args,
    },
  });
}

export async function deleteRoute(parent: any, args: any, context: any) {
  await prisma.route.delete({
    where: {
      id: args.id,
    },
  });
}
