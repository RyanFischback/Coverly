import { GraphQLScalarType, Kind } from "graphql";
import { toUtc } from "../types/DateTime";

export const dateScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "ISO-8601 UTC DateTime scalar",
  serialize(value: unknown): string {
    return toUtc(value as Date).toISOString();
  },
  parseValue(value: unknown) {
    return toUtc(value as string);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return toUtc(ast.value);
    }
    return null;
  },
});
