import { Route } from "@prisma/client"

export type UserType = `
    id: BigInteger
    email: String
    firstName: String
    lastName:    String
    password: String
    avatar: String
    username: String
    tel: String
    routes: [Route]
  `