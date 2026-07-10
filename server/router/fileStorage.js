import express from "express.js"
import uploadMiddleware from "../middleware/fileMulter.js";
import {upload, view , download, removeOne, removeAll} from "../controllers/file.controller.js";

const router = express.Router();

router.post("/upload", upload.single("file"), upload);

export default router; 