import File from "../models/file.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// To get the directory name in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImage = async (req, res) => {
  const fileObj = {
    path: req.file.path,
    name: req.file.originalname,
  };
  try {
    const file = await File.create(fileObj);
    
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT}`
    
    res
      .status(200)
      .json({ path: `${baseUrl}/file/${file._id}` });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const downloadImage = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // console.log("File path: ", file.path);

    file.downloadCount += 1;
    await file.save();

    const filePath = path.join(__dirname, '..', file.path); // Resolving the relative path to absolute

    // Send the file for download
    res.download(filePath, file.name, (err) => {
      if (err) {
        return res.status(500).json({ err: err.message });
      }
    });
  } catch (err) {
    // console.log(err.message);
    return res.status(500).json({ err: err.message });
  }
};