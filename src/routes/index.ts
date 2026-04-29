import express, { Application } from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import postRouter from "./post.routes";
import uploadRouter from "./upload.routes";

function routerApi(app: Application) {
  const router = express.Router();
  app.use("/api", router);

  router.use("/auth", authRouter);
  router.use("/users", userRouter);
  router.use("/blog", postRouter);
  router.use("/upload", uploadRouter);
}

export default routerApi;
