import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const port = process.env.PORT;

app.get("/users", (req, res) => {
  res.send("hello world !");
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
