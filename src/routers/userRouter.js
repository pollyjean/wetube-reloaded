import express from "express";
import multer from "multer";
import { viewProfile, getEditUser, postEditUser, logout, startGithubLogin, finishGithubLogin, postEditPassword, startKakaoLogin, finishKakaoLogin } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, uploadAvatarMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.all(protectorMiddleware).get("/logout", logout);
userRouter.get("/edit", protectorMiddleware, getEditUser)
userRouter.all(protectorMiddleware).post("/edit/user-data", uploadAvatarMiddleware.single("avatar"), (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      req.flash("error", "File too large");
      res.status(413).redirect("/users/edit");
    }
  } else if (err) {
    res.status(500).send({ message: 'Unknown error occurred' });
  }
}, postEditUser);
userRouter.all(protectorMiddleware).post("/edit/password", postEditPassword)
userRouter.all(publicOnlyMiddleware).get("/github/start", startGithubLogin);
userRouter.all(publicOnlyMiddleware).get("/github/finish", finishGithubLogin);
userRouter.all(publicOnlyMiddleware).get("/kakao/start", startKakaoLogin);
userRouter.all(publicOnlyMiddleware).get("/kakao/finish", finishKakaoLogin);
userRouter.get("/:id", viewProfile);

export default userRouter;
