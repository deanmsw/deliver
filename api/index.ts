import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import { ApolloServer } from 'apollo-server-express'
import {  allUsers, User, updateUser, deleteUser } from '../Resolvers/User'
import { createUser } from '../Resolvers/Auth';
import { allRoutes, route, createRoute, updateRoute, deleteRoute } from '../Resolvers/Routes';

import jwt from 'jsonwebtoken'


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
    firstName: String
    lastName:    String
    password: String
    avatar: String
    username: String
    tel: Int
    routes:  [Route]
  }
  type Route {
    id: Int
    title: String
    description: String
  }

  type AuthPayload {
  token: String
  user: User
}


  type Query {

    allUsers: [User!]!,
    User(email: String!): [User!]!,

    allRoutes: [Route!]!,
    route(id: Int!): [ Route],


  }

  type Mutation {

    createUser(
      email: String!
      password: String!, 
      firstName: String!, 
      lastName: String!
      ): AuthPayload,
      

    updateUser(email: String!, password: String, firstName: String, lastName: String): User,
    deleteUser( email: String! ): User

    createRoute(
      title: String!
      description: String!
      ): Route
    
    deleteRoute( id: Int!): Route
    updateRoute(
    id: Int!,
    title: String, 
    description: String, 
    ): Route

  }
`;


const resolvers = {

  Query: {

    allUsers,
    User,
    allRoutes,
    route

  },
  Mutation: {
    createUser,
    updateUser,
    deleteUser,
    createRoute,
    updateRoute,
    deleteRoute
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

    return {
      ...req,
      // user: user,
      
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