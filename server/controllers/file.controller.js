import { success } from "zod";
import {
  storageFile,
  fileList,
  viewFile,
  downloadFile,
  removeOneFile,
  removeAllFile,
} from "../services/storageService.js";

// controllers/fileController.js
// controllers/fileController.js
const upload = async (req, res) => {
  try {
    // ✅ Get user ID from JWT
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files uploaded",
      });
    }

    // ✅ Pass userId to storageFile
    const paths = await Promise.all(
      req.files.map((file) => storageFile(file, userId)),
    );

    res.status(201).json({
      success: true,
      message: "Files uploaded successfully",
      files: paths,
      count: paths.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// controllers/fileController.js
const list = async (req, res) => {
  try {
    // ✅ Get user ID from JWT
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    // ✅ Pass userId to fileList
    const files = await fileList(userId);

    res.status(200).json({
      success: true,
      count: files.length,
      files,
    });
  } catch (error) {
    console.error("List error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const view = async (req, res) => {
  try {
    const { filePath } = req.params;
    const decodePath = decodeURIComponent(filePath);

    if (!decodePath) {
      return res.status(400).json({
        success: false,
        error: "File path is required",
      });
    }

    const result = await viewFile(decodePath);

    res.status(200).json({
      success: true,
      url: result,
    });
  } catch (error) {
    console.error("View error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const download = async (req, res) => {
  try {
    const { filePath } = req.params;
    const decodePath = decodeURIComponent(filePath);

    if (!decodePath) {
      return res.status(400).json({
        success: false,
        error: "File path is required",
      });
    }
    const file = await downloadFile(decodePath);
    const buffer = Buffer.from(await file.arrayBuffer());
    

    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeOne = async (req, res) => {
  try {
    const { filePath } = req.params;
    const decodePath = decodeURIComponent(filePath);

    if (!decodePath) {
      return res.status(400).json({
        success: false,
        error: "File path is required",
      });
    }
    const result = await removeOneFile(decodePath);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeAll = async (req, res) => {
  try {
    const result = await removeAllFile();
    res.status(200).json({
      success: true,
      message: "All files deleted",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export { upload, list, view, download, removeOne, removeAll };
