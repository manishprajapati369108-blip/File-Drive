import { useState, useRef } from "react";
import axios from "axios";

const DropBox = ({ onUploadSuccess }) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (selectedFiles) => {
    // ✅ Check if files exist
    if (!selectedFiles || selectedFiles.length === 0) return;

    // ✅ Check TOTAL combined size
    if (selectedFiles.size > 10 * 1024 * 1024) {
      alert(
        `Total file size exceeds 10MB limit! (${(selectedFiles.size / 1024 / 1024).toFixed(2)}MB)`,
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
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/file/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
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
    //prev or any parameter in state set state variable is always calling current state value
    
    
    handleUpload(newFiles);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
      >
        <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4"
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

          <p className="mb-2 text-sm">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs">Multiple files allowed (Total max 10MB)</p>

          {uploading && (
            <div className="w-full mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-center mt-1 text-gray-600">
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
