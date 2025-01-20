import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import 

import userRouter from "./routes/user.routes.js"
import jobRouter from "./routes/jobs.routes.js"
import applicationRouter from "./routes/application.routes.js"


// routes declaration 

app.use("/v1/users",userRouter)
app.use("/v1/jobs",jobRouter)
app.use("/v1/application",applicationRouter)

export { app }