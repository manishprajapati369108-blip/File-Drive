import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./router/authRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;

app.use("/home", authRoute);

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
