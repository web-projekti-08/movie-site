import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config.js";

import movieRouter from "./routers/movie_router.js";
import groupRouter from "./routers/group_router.js";
import reviewRouter from "./routers/review_router.js";
import userRouter from "./routers/auth_router.js";

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("Postgres API (movie version)");
});

app.use("/movie", movieRouter);
app.use("/groups", groupRouter);
app.use("/review", reviewRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});