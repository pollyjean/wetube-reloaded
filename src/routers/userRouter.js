import express from "express";
import { seeUser, getEditUser, postEditUser, logout, startGithubLogin, finishGithubLogin, postEditPassword } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, removeCacheMiddleware, uploadFilesMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.all(removeCacheMiddleware, protectorMiddleware).get("/logout", logout);
userRouter.all(protectorMiddleware).get("/edit", getEditUser)
userRouter.all(removeCacheMiddleware, protectorMiddleware).post("/edit/user-data", uploadFilesMiddleware.single("avatar"), postEditUser);
userRouter.all(protectorMiddleware).post("/edit/password", postEditPassword)
userRouter.all(publicOnlyMiddleware).get("/github/start", startGithubLogin);
userRouter.all(removeCacheMiddleware, publicOnlyMiddleware).get("/github/finish", finishGithubLogin);
userRouter.get("/:id", seeUser);

export default userRouter;
