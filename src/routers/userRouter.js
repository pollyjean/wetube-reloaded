import express from "express";
import { viewProfile, getEditUser, postEditUser, logout, startGithubLogin, finishGithubLogin, postEditPassword } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, refreshMiddleware, uploadAvatarMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.all(protectorMiddleware).get("/logout", logout, refreshMiddleware);
userRouter.get("/edit", protectorMiddleware, getEditUser)
userRouter.all(protectorMiddleware).post("/edit/user-data", uploadAvatarMiddleware.single("avatar"), postEditUser);
userRouter.all(protectorMiddleware).post("/edit/password", postEditPassword)
userRouter.all(publicOnlyMiddleware).get("/github/start", startGithubLogin);
userRouter.all(publicOnlyMiddleware).get("/github/finish", finishGithubLogin, refreshMiddleware);
userRouter.get("/:id", viewProfile);

export default userRouter;
