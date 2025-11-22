import express from "express";
import cors from "cors";
import "dotenv/config.js";
import movieRouter from "./routers/movie_router.js";
import groupRouter from "./routers/group_router.js";
import authRouter from "./routers/auth_router.js";
import { createUsersTable } from "./models/auth_model.js";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

createUsersTable();

app.get("/", (_req, res) => {
  res.send("Postgres API (movie version)");
});

app.use("/movie", movieRouter);
app.use("/groups", groupRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});