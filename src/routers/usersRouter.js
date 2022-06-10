import express from "express";
import { getUsers } from "../controllers/userController.js";
import { tokenValidator } from "../middlewares/userMiddlewares.js";

const userRouter = express.Router();

userRouter.get('/users/:id',tokenValidator, getUsers)

export default userRouter;