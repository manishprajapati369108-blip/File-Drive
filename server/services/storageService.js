import { createClient } from "@supabase/supabase-js/dist/index.cjs";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

const storageFile = async (file) => {
  const filePath = `uploads/${Date.now()}-${file.originalname}`;
  const { data, error } = await supabase.storage
    .from("filedrive")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  return data.path;
};

const viewFile = async (savedPath) => {
  const { data, error } = await supabase.storage
    .from("filedrive")
    .createSignedUrl(savedPath, 60);

  if (error) {
    throw error;
  }

  return data;
};

const downloadFile = async (savedPath) => {
  const { data, error } = await supabase.storage
    .from("filedrive")
    .download(savedPath);

  if (error) {
    throw error;
  }

  return data;
};

const removeOneFile = async (savedPath) => {
  const { data, error } = await supabase.storage
    .from("filedrive")
    .remove([savedPath]);

  if (error) {
    throw error;
  }

  return data;
};

const removeAllFile = async () => {
  const { data: files, error } = await supabase.storage
    .from("filedrive")
    .list("uploads");

  if (error) {
    throw error;
  }

  const path = files.map((file) => `uploads/${file.name}`);

  const { data, error: deleteError } = await supabase.storage.from("filedrive").remove(path);
  if (deleteError) {
    throw deleteError;
  }

  return data;
};

export { storageFile, viewFile, downloadFile, removeOneFile, removeAllFile };
