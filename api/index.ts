import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import { ApolloServer } from 'apollo-server-express'
import {  allUsers, User } from '../Resolvers/User'
import { createUser } from '../Resolvers/Auth';

import jwt from 'jsonwebtoken'

// const prisma = new PrismaClient();

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
            },
        );
        return { loggedIn: true, payload: payload };
    } catch (err) {
        // Failed Login Status
        return { loggedIn: false };
    }
};


const typeDefs = `

  type User {

    email: String!

    name: String

  }

  type AuthPayload {
  token: String
  user: User
}


  type Query {

    allUsers: [User!]!,
    User: [User!]!,


  }

  type Mutation {

    createUser(
      email: String!
      password: String!, 
      firstName: String!, 
      lastName: String!
      ): AuthPayload,


  }

`;


const resolvers = {

  Query: {

    allUsers,
    User

  },
  Mutation: {
    createUser
  }

};

async function serverStart () {
const server = new ApolloServer({ 
  resolvers, 
  typeDefs,
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],

  context: async ({ req }) => {

    let currentUser = null;

    const token = req.headers.authorization;

    const { payload: user, loggedIn } = await verifyUser(token)

    // console.log(user, 'user ', loggedIn, 'logged in', token);

    if (!user) {
      currentUser = null;
    }
}
});

// server.listen({ port: 4000 });
await server.start()
const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
}

serverStart()