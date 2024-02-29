import { PrismaClient } from '@prisma/client';
import { ApolloError } from 'apollo-server-core';

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
// export async function createRoute(parent: any, args: any, context: any) {
//   // Check if the specified driver exists
//   const existingUser = await prisma.user.findUnique({
//     where: {
//       id: args.driverId,
//     },
//   });

//   const existingDriver = await prisma.driver.findUnique({
//     where: {
//       id: args.driverId,
//     },
//   });

//   const checkDriverExists = () => {
//     if (existingDriver) {
//       return { userId: existingDriver.userId };
//     } else {
//       const createDriver = prisma.driver.create({
//         data: {
//           // @ts-ignore
//           user: existingUser,
//           userId: args.driverId,
//         },
//       });
//       console.log(createDriver, 'hey');
//       return createDriver;
//     }
//   };
//   console.log(checkDriverExists(), 'shag');
//   if (!existingUser) {
//     throw new Error(`User with Id: ${args.driverId} not found.`);
//   }

//   const startLocation = {
//     latitude: args.startLocation.latitude,
//     longitude: args.startLocation.longitude,
//   };

//   const endLocation = {
//     latitude: args.endLocation.latitude,
//     longitude: args.endLocation.longitude,
//   };

//   return await prisma.route.create({
//     data: {
//       ...args,
//       startLocation: {
//         create: startLocation,
//       },
//       endLocation: {
//         create: endLocation,
//       },
//       driver: {
//         connect: checkDriverExists(),
//       },
//     },
//     include: {
//       driver: true,
//       journeys: true,
//       startLocation: true,
//       endLocation: true,
//     },
//   });
// }

export async function createRoute(parent: any, args: any, context: any) {
  try {
    // Check if the specified driver exists
    const existingUser = await prisma.user.findUnique({
      where: { id: args.driverId },
    });

    if (!existingUser) {
      throw new Error(`User with ID ${args.driverId} not found.`);
    }

    // Create or connect the driver
    const driver = await prisma.driver.upsert({
      where: { userId: existingUser.id },
      create: { userId: existingUser.id },
      update: {},
    });

    // Create start and end locations
    const startLocation = {
      create: {
        latitude: args.startLocation.latitude,
        longitude: args.startLocation.longitude,
      },
    };

    const endLocation = {
      create: {
        latitude: args.endLocation.latitude,
        longitude: args.endLocation.longitude,
      },
    };

    // Create the route
    const route = await prisma.route.create({
      data: {
        title: 'route one',
        description: 'test one',
        driver: { connect: { userId: driver.userId } }, // Use connect instead of specifying driverId
        startLocation,
        endLocation,
      },
      include: { driver: true, startLocation: true, endLocation: true },
    });

    return route;
  } catch (error) {
    console.error('Error creating route:', error);
    throw new ApolloError('Failed to create route.', 'INTERNAL_SERVER_ERROR');
  }
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
