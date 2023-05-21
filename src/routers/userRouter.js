import express from "express";
import { seeUser, getEditUser, postEditUser, logout, startGithubLogin, finishGithubLogin, postEditPassword } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, removeCacheMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.all(removeCacheMiddleware, protectorMiddleware).get("/logout", logout);
userRouter.get("/edit", protectorMiddleware, getEditUser)
userRouter.all(removeCacheMiddleware, protectorMiddleware).post("/edit/user-data", postEditUser);
userRouter.post("/edit/password", protectorMiddleware, postEditPassword)
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.all(removeCacheMiddleware, publicOnlyMiddleware).get("/github/finish", finishGithubLogin);
userRouter.get("/:id", seeUser);

export default userRouter;
