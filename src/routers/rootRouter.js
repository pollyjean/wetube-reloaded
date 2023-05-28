import express from "express";
import { getJoin, postJoin, getLogin, postLogin } from "../controllers/userController";
import { home, searchVideo } from "../controllers/videoController";
import { publicOnlyMiddleware, refreshMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home, refreshMiddleware);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin, refreshMiddleware);
rootRouter.get("/search", searchVideo);

export default rootRouter;
