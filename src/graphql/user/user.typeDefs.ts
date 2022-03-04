import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  type CreateUser {
    name: String!
    email: String!
  }

  type GetUser {
    name: String
    email: String
  }

  type Response {
    message: String
    status: String
  }

  type Mutation {
    createUser(name: String, email: String, password: String): CreateUser

    deleteUser(currentPassword: String): Response

    updateUser(
      toUpdate: String!
      email: String
      password: String
      name: String
      currentPassword: String
    ): CreateUser
  }

  type Query {
    readUser: GetUser
  }
`;
