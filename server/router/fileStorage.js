import express from "express";
import uploadMiddleware from "../middleware/fileMulter.js";
import {
  upload,
  view,
  download,
  removeOne,
  removeAll,
} from "../controllers/file.controller.js";

const router = express.Router();

router.post("/upload", uploadMiddleware.array("files"), upload);
router.get("/view", view);
router.get("/download", download);
router.delete("/remove-one", removeOne);
router.delete("/remove-all", removeAll);

export default router;