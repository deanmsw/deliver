import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

import { ApolloServer } from 'apollo-server-express';
import { allUsers, User, updateUser, deleteUser } from '../Resolvers/User';
import { createUser } from '../Resolvers/Auth';
import {
  allRoutes,
  route,
  createRoute,
  updateRoute,
  deleteRoute,
} from '../Resolvers/Routes';

import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const verifyUser = (token: any) => {
  try {
    // Verify JWT Token
    const payload = jwt.verify(
      token,
      'hello world',
      function (err: any, decoded: any) {
        if (err) {
          return null;
        }

        return decoded;
      }
    );
    return { loggedIn: true, payload: payload };
  } catch (err) {
    // Failed Login Status
    return { loggedIn: false };
  }
};

const resolvers = {
  Query: {
    allUsers,
    User,
    allRoutes,
    route,
  },
  Mutation: {
    createUser,
    updateUser,
    deleteUser,
    createRoute,
    updateRoute,
    deleteRoute,
  },
};

async function serverStart() {
  const server = new ApolloServer({
    resolvers,
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],

    context: async ({ req }) => {
      let currentUser = null;

      const token = req.headers.authorization;

      const { payload: user, loggedIn } = await verifyUser(token);

      // console.log(user, 'user ', loggedIn, 'logged in', token);

      if (!user) {
        currentUser = null;
      }

      return {
        ...req,
        // user: user,
      };
    },
  });

  // server.listen({ port: 4000 });
  await server.start();
  const app = express();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

serverStart();
