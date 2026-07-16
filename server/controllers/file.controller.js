import { success } from "zod";
import {
  storageFile,
  viewFile,
  downloadFile,
  removeOneFile,
  removeAllFile,
} from "../services/storageService.js";

const upload = async (req, res) => {
  try {
    
    const paths = await Promise.all(
      req.files.map((file) => storageFile(file))
    ) 

    res.status(201).json({
      success : true,
      message : paths
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const view = async (req, res) => {
  try {
    const result = await viewFile(req.body.filePath);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const download = async (req, res) => {
  try {
    const result = await downloadFile(req.body.filePath);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeOne = async (req, res) => {
  try {
    const result = await removeOneFile(req.body.filePath);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeAll = async (req, res) => {
  try {
    const result = await removeAllFile();
    res.status(200).json({
      message: "All files deleted",
      result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { upload, view, download, removeOne, removeAll };
