import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Create __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📁 Current file:', __filename);
console.log('📁 Current directory:', __dirname);

// ✅ Go up one level to root
const rootDir = path.resolve(__dirname, '..');
console.log('📁 Root directory:', rootDir);

// ✅ Load .env from root
dotenv.config({ path: path.join(rootDir, '.env') });

console.log('🔍 SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('SUPABASE_SECRET_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  throw new Error('Supabase configuration is incomplete');
}


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

// ✅ FIXED: Upload saves in user's folder
const storageFile = async (file, userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // ✅ Use user folder
  const filePath = `uploads/${userId}/${Date.now()}-${file.originalname}`;
  
  const { data, error } = await supabase.storage
    .from("filedrive")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  return data.path;
};

// ✅ FIXED: fileList filters by user
const fileList = async (userId) => {
  if (!userId) {
    return [];
  }
  
  const { data: files, error } = await supabase.storage
    .from("filedrive")
    .list(`uploads/${userId}`);  // ← Only this user's folder!

  if (error) {
    throw error;
  }
  return files.map(file => ({
    id: file.id,
    originalname : file.name.replace(/^\d+-/, ""),
    name: file.name,
    filePath: `uploads/${userId}/${file.name}`,
    size: file.metadata?.size || 0,
    type: file.metadata?.mimetype || 'unknown',
    created_at: file.created_at
  }));
};

const viewFile = async (savedPath) => {
  console.log(savedPath)
  const { data, error } = await supabase.storage
    .from("filedrive")
    .createSignedUrl(savedPath, 60);

  if (error) {
    throw error;
  }

  return data.signedUrl;
};

const downloadFile = async (savedPath) => {
  const { data , error } = await supabase.storage
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

export { storageFile, fileList, viewFile, downloadFile, removeOneFile, removeAllFile };
