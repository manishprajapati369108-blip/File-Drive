import express from "express";
import uploadMiddleware from "../middleware/fileMulter.js";
import {
  upload,
  list,
  view,
  download,
  removeOne,
  removeAll,
} from "../controllers/file.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload",protect, uploadMiddleware.array("files"), upload);
router.get("/list",protect, list)
router.get("/view/:filePathed",protect, view);
router.get("/download/:filePath", protect,download);
router.delete("/remove-one/:filePath",protect, removeOne);
router.delete("/remove-all",protect, removeAll);

export default router;