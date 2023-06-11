import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import cors from "cors";
import path from "path";
import favicon from "serve-favicon";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", `${process.cwd()}/src/views`);
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL })
  })
);
app.use(flash());
app.use(cors({ origin: true }));
app.use(favicon(path.join(__dirname, "../", "favicon.ico")));
app.use(localsMiddleware);
app.use("/public", express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/dist", express.static("dist"));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);
app.use((req, res) => { return res.status(404).render("404") });

export default app;
