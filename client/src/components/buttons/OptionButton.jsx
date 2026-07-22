// components/buttons/OptionButton.jsx
import { SlOptionsVertical } from "react-icons/sl";
import axios from "axios";

const OptionButton = ({ file, onDelete, onRefresh }) => {
  // ✅ View - Open file in new tab
  const handleView = async (e) => {
    const fileClick = e.target.file.filePath
    if (!file?.filePath) {
      alert("File path is missing!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`/api/file/view/${file.filePath}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.url) {
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
      const token = localStorage.getItem("token");

      const response = await axios.get(`/api/file/download/${file.filePath}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // ← Important for file download!
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = getDisplayName(file.name) || "download";
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
      const token = localStorage.getItem("token");

      await axios.delete(`/api/file/remove/${file.filePath}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("File deleted successfully!");

      // Call parent callbacks
      if (onDelete) onDelete(file.id);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.error || "Failed to delete file");
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
    <div className="dropdown dropdown-bottom dropdown-end">
      <div tabIndex={0} role="button" className="btn m-1">
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
      </ul>
    </div>
  );
};

export default OptionButton;
