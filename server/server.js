import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./router/authRoutes.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(cors({ credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT;

app.use("/auth", authRoutes);

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`server listening on ${port}`);
    });
  } catch (error) {
    console.log("something went wrong");
    console.log(error.message);
  }
};

start();
