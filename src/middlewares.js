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

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "polyjean-aws-first-bucket",
  acl: "public-read",
  key: (req, file, cb) => {
    cb(null, `images/${file.originalname}`)
  }
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "polyjean-aws-first-bucket",
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    cb(null, `videos/${file.originalname}`)
  }
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "weTube";
  res.locals.user = req.session.user || {};
  res.locals.execRefresh = false;
  res.locals.isHosting = process.env.NODE_ENV === "production";
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
export const uploadAvatarMiddleware = multer({
  dest: "uploads/avatars",
  limits: {
    fileSize: 300000,
  },
  storage: (process.env.NODE_ENV === "production") ? s3ImageUploader : undefined,
});
export const uploadVideoMiddleware = multer({
  dest: "uploads/video",
  limits: {
    fileSize: 30000000,
  },
  storage: (process.env.NODE_ENV === "production") ? s3VideoUploader : undefined,
});