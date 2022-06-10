import express from "express";

import { signIn, signUp } from "../controllers/authControllers.js";

import {signUpValidator, signInValidator} from "../middlewares/authMiddlewares.js"

const authRouter = express.Router()

authRouter.post('/signup', signUpValidator,signUp);
authRouter.post('/signin', signInValidator, signIn);

export default authRouter;