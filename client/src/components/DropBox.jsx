import { useState, useRef } from "react";
import axios from "axios";

const DropBox = ({ onUploadSuccess }) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleUpload = async (selectedFiles) => {
    // ✅ Check if files exist
    if (!selectedFiles || selectedFiles.length === 0) return;

    // ✅ Check TOTAL combined size
    if (selectedFiles.size > 10 * 1024 * 1024) {
      alert(
        `Total file size exceeds 10MB limit! (${(selectedFiles.size / 1024 / 1024).toFixed(2)}MB)`
      );
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("files", file);
    });

    setUploading(true);
    setProgress(0);

    try {
    

      const response = await axios.post(`${api}/file/upload`, formData, {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          }
        },
      });

      if (response.data.success) {
        console.log("File uploaded:", response.data.message);
        setProgress(0);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        if (onUploadSuccess) {
          onUploadSuccess();
        }

        alert("File uploaded successfully!");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Upload failed");
      console.log(error.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files);
    handleUpload(newFiles);
  };

  return (
    <div className="flex items-center justify-center w-full px-4 py-10 -mt-50">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full max-w-3xl h-80 bg-white border-2 border-dashed border-blue-400 rounded-2xl shadow-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all duration-300"
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 text-center text-gray-700">
          <svg
            className="w-12 h-12 mb-4 text-blue-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
            />
          </svg>

          <p className="mb-2 text-lg text-gray-800">
            <span className="font-bold text-blue-600">Click to upload</span> or
            drag and drop
          </p>

          <p className="text-sm text-gray-500">
            Multiple files allowed (Total max 10MB)
          </p>

          {uploading && (
            <div className="w-full mt-6">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient from-blue-500 to-indigo-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-sm font-medium text-gray-700">
                {progress}%
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          id="dropzone-file"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
};

export default DropBox;