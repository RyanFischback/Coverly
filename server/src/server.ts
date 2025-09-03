import { config } from "dotenv";
import { connectDB } from "./functions/connectDB";
import app from "./app";
import { startApolloServer } from "./graphql/apollo"; 

config();

async function start() {
  await connectDB();
  await startApolloServer(app);
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

start();
