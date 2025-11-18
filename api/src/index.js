import express from "express";
import cors from "cors";
import "dotenv/config.js";
import movieRouter from "./routers/movie_router.js";
import groupRouter from "./routers/group_router.js";
import reviewRouter from "./routers/review_router.js"

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
  res.send("Postgres API (movie version)");
});

app.use("/movie", movieRouter);
app.use("/groups", groupRouter);
app.use("/review", reviewRouter);

app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});