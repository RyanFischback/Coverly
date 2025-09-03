import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar DateTime

  type Resume {
    id: ID!
    url: String!
    uploadedAt: DateTime!
    fileName: String
    fileType: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    resumes: [Resume!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    allUsers: [User!]!
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    uploadResume(fileUrl: String!, fileName: String, fileType: String): Resume
  }`;
