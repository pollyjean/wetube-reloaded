import express from "express";
import { viewProfile, getEditUser, postEditUser, logout, startGithubLogin, finishGithubLogin, postEditPassword } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, removeCacheMiddleware, uploadAvatarMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.all(removeCacheMiddleware, protectorMiddleware).get("/logout", logout);
userRouter.get("/edit", protectorMiddleware, getEditUser)
userRouter.all(removeCacheMiddleware, protectorMiddleware).post("/edit/user-data", uploadAvatarMiddleware.single("avatar"), postEditUser);
userRouter.all(protectorMiddleware).post("/edit/password", postEditPassword)
userRouter.all(publicOnlyMiddleware).get("/github/start", startGithubLogin);
userRouter.all(removeCacheMiddleware, publicOnlyMiddleware).get("/github/finish", finishGithubLogin);
userRouter.get("/:id", viewProfile);

export default userRouter;
