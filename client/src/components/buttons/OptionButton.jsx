// components/buttons/OptionButton.jsx
import { SlOptionsVertical } from "react-icons/sl";
import axios from "axios";
import { useState } from "react";
import ShareButton from "./ShareButton";

const OptionButton = ({ file, onDelete }) => {
  const [showShare, setShowShare] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // ✅ View - Open file in new tab
  const handleView = async () => {
    if (!file?.filePath) {
      alert("File path is missing!");
      return;
    }

    try {
      const response = await axios.get(
        `/api/file/view/${encodeURIComponent(file.filePath)}`,
        {
          withCredentials: true,
        },
      );

      console.log(response.data);

      if (response.data.success) {
        console.log(response.data.url);
        window.open(response.data.url, "_blank");
      }
    } catch (error) {
      console.error("View error:", error);
      alert(error.response?.data?.error || "Failed to view file");
    }
  };

  // ✅ Download - Download file
  const handleDownload = async () => {
    if (!file?.filePath) {
      alert("File path is missing!");
      return;
    }

    try {
      const response = await axios.get(
        `/api/file/download/${encodeURIComponent(file.filePath)}`,
        {
          withCredentials: true,
          responseType: "blob", // ← Important for file download!
        },
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = file.name || "download";

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert(error.response?.data?.error || "Failed to download file");
    }
  };

  // ✅ Delete - Delete file with confirmation
  const handleDelete = async () => {
    console.log("OptionButton props:", file, onDelete);
    if (!file?.filePath) {
      alert("File path is missing!");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete "${getDisplayName(file.name)}"?`,
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `/api/file/remove-one/${encodeURIComponent(file.filePath)}`,
        {
          withCredentials: true,
        },
      );

      alert("File deleted successfully!");

      // Call parent callbacks
      if (onDelete) {
        onDelete(file.filePath);
      }
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("URL:", error.config?.url);

      alert(error.response?.data?.error || "Failed to delete file");

      console.error("Delete error:", error);
      alert(error.response?.data?.error || "Failed to delete file");
    }
  };

  const handleShare = async (e) => {
    e.currentTarget.blur();
    setShowMenu(false);

    try {
      const response = await axios.get(
        `/api/file/view/${encodeURIComponent(file.filePath)}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setShareUrl(response.data.url);
        setShowShare(true);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to get share URL");
    }
  };

  // ✅ Helper: Display name (remove timestamp)
  const getDisplayName = (fileName) => {
    if (!fileName) return "";
    const parts = fileName.split("-");
    if (parts.length > 1 && !isNaN(parts[0])) {
      return parts.slice(1).join("-");
    }
    return fileName;
  };

  return (
    <>
      <div
        className={`dropdown dropdown-bottom dropdown-end ${showMenu ? "dropdown-open" : ""}`}
      >
        <div
          tabIndex={0}
          role="button"
          className="btn m-1"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {" "}
          <SlOptionsVertical />
        </div>
        <ul
          tabIndex="-1"
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm  border border-[white]"
        >
          <li>
            <button
              className="border border-[white]  active:bg-[white] `px-4 py-2 rounded
              transition-all duration-500 ease-in-out"
              onClick={handleView}
            >
              View
            </button>
          </li>
          <li>
            {" "}
            <button
              className="border border-[white]  active:bg-[white] `px-4 py-2 rounded
              transition-all duration-500 ease-in-out"
              onClick={handleDownload}
            >
              Download
            </button>
          </li>
          <li>
            <button
              className="border border-[white]  active:bg-[white] `px-4 py-2 rounded
              transition-all duration-500 ease-in-out"
              onClick={handleDelete}
            >
              Remove
            </button>
          </li>
          <li>
            <button
              className="border border-[white]  active:bg-[white] `px-4 py-2 rounded
              transition-all duration-500 ease-in-out"
              onClick={handleShare}
            >
              Share
            </button>
          </li>
        </ul>
      </div>
      {showShare && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <ShareButton
            text={file.name}
            url={shareUrl}
            onClose={() => setShowShare(false)}
          />
        </div>
      )}
    </>
  );
};

export default OptionButton;
