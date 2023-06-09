import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const multerUploader = multerS3({
  s3: s3,
  bucket: 'polyjean-aws-first-bucket',
  acl: "public-read",
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "weTube";
  res.locals.user = req.session.user || {};
  res.locals.execRefresh = false;
  next();
}
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not authorized.")
    return res.redirect("/login");
  }
};
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized.")
    return res.redirect("/");
  }
}
export const refreshMiddleware = (req, res, next) => {
  res.locals.execRefresh = true;
  next();
}

export const uploadAvatarMiddleware = multer({
  dest: "uploads/avatars",
  limits: {
    fileSize: 300000,
  },
  storage: multerUploader,
});
export const uploadVideoMiddleware = multer({
  dest: "uploads/video",
  limits: {
    fileSize: 30000000,
  },
  storage: multerUploader,
});