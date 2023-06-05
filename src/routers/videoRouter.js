import express from "express";
import { watch, postEdit, getEdit, getUpload, postUpload, deleteVideo, getRecord } from "../controllers/videoController";
import { protectorMiddleware, uploadVideoMiddleware } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload)
  .post(uploadVideoMiddleware.fields([
    { name: "videoUpload", maxCount: 1 },
    { name: "thumbUpload", maxCount: 1 }]), postUpload);
videoRouter.get("/:id([0-9a-f]{24})/delete", protectorMiddleware, deleteVideo);
videoRouter.get("/record", protectorMiddleware, getRecord)

export default videoRouter;
