import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import chatRoutes from "./routes/chatRoutes.js";
import { initSocket } from "./socket/socketHandler.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

connectDB();
app.use("/api/chat", chatRoutes);

initSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`🚀 Chat server running on port ${process.env.PORT}`);
});
