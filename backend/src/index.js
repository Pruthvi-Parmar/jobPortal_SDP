import connectDB from "./db/index.js";
import dotenv from "dotenv"
import { app } from "./app.js";

dotenv.config({
    path : './backend/env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server is runnong at ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("DB Connection error from async promise!")
})