import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { verifyToken } from "../functions/auth";

export interface GraphQLContext {
  userId?: string;
}

export async function startApolloServer(app: any) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const auth = req.headers.authorization || "";
      if (auth.startsWith("Bearer ")) {
        const token = auth.split(" ")[1];
        const decoded = verifyToken(token);
        if (decoded) {
          return { userId: decoded.userId };
        }
      }
      return {};
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
  console.log(`mounted at /graphql`);
}

