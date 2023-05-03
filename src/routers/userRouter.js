import express from "express";
import { seeUser, editUser, deleteUser, logout } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", editUser);
userRouter.get("/logout", logout);
userRouter.get("/delete", deleteUser);
userRouter.get("/:id", seeUser);

export default userRouter;
