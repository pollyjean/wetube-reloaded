import express from "express";
import { getJoin, postJoin, getLogin, postLogin } from "../controllers/userController";
import { home, searchVideo } from "../controllers/videoController";
import { publicOnlyMiddleware, removeCacheMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(removeCacheMiddleware, publicOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.get("/search", searchVideo);

export default rootRouter;
