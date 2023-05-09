import express from "express";
import { getJoin, postJoin, login } from "../controllers/userController";
import { home, searchVideo } from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/login", login);
rootRouter.get("/search", searchVideo);

export default rootRouter;
