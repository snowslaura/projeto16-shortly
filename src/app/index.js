import express, {json} from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./../routers/AuthRouter.js"
import urlRouter from "../routers/UrlRouter.js";

const app = express()

app.use(cors())
app.use(json())
app.use(authRouter)
app.use(urlRouter)


const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: http://localhost:${PORT}`)
})


