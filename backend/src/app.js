import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from "http";
import { initSocket } from "./utils/socketHandler.js";
import passport from "./utils/passport.js";


const app = express()
const server = http.createServer(app);



// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))
app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://jobconnect-three.vercel.app"
  ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
}))
// app.use(cors())


app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import 

import userRouter from "./routes/user.routes.js"
import jobRouter from "./routes/jobs.routes.js"
import applicationRouter from "./routes/application.routes.js"
import adminRouter from "./routes/admin.routes.js"
import chatbotRouter from "./routes/chatbot.routes.js"
import paymentRouter from "./routes/payment.routes.js"
import chatRouter from "./routes/chat.routes.js"
import resumeAnalyseRouter from "./routes/analyse.routes.js"
import complaintRoute from "./routes/complaint.routes.js"

// oauth route

import authRoutes from "./routes/oAuth.routes.js";

// routes declaration 

app.use("/v1/users",userRouter)
app.use("/v1/jobs",jobRouter)
app.use("/v1/application",applicationRouter)
app.use("/v1/admin",adminRouter)
app.use("/v1/chatbot",chatbotRouter)
app.use("/v1/payment",paymentRouter)
app.use("/v1/chat",chatRouter)
app.use("/v1/resume",resumeAnalyseRouter)
app.use("/v1/complaint",complaintRoute)

app.use(passport.initialize());
app.use("/auth", authRoutes);

initSocket(server);
server.listen(process.env.PORT, () => {
    console.log(`🚀 Chat server running on port ${process.env.PORT}`);
  });

export { app }